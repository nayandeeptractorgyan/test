const Ticket = require('../models/Ticket');
const TicketClass = require('../models/TicketClass');
const User = require('../models/User');
const ExcelJS = require('exceljs');

const getDateRange = (filter, startDate, endDate, month, year) => {
  const now = new Date();
  let start, end;
  switch (filter) {
    case 'daily':
      start = new Date(now); start.setHours(0,0,0,0);
      end = new Date(now); end.setHours(23,59,59,999);
      break;
    case 'monthly':
      const m = month ? parseInt(month)-1 : now.getMonth();
      const y = year ? parseInt(year) : now.getFullYear();
      start = new Date(y, m, 1);
      end = new Date(y, m+1, 0, 23, 59, 59, 999);
      break;
    case 'yearly':
      const yr = year ? parseInt(year) : now.getFullYear();
      start = new Date(yr, 0, 1);
      end = new Date(yr, 11, 31, 23, 59, 59, 999);
      break;
    case 'range':
      start = startDate ? new Date(startDate) : new Date(now.setHours(0,0,0,0));
      end = endDate ? new Date(new Date(endDate).setHours(23,59,59,999)) : new Date();
      break;
    default:
      start = new Date(now); start.setHours(0,0,0,0);
      end = new Date(now); end.setHours(23,59,59,999);
  }
  return { start, end };
};

exports.getReport = async (req, res) => {
  try {
    const { filter = 'daily', startDate, endDate, month, year, operatorId } = req.query;
    const { start, end } = getDateRange(filter, startDate, endDate, month, year);
    const mongoose = require('mongoose');

    const matchQuery = { createdAt: { $gte: start, $lte: end }, isVoided: false };
    if (operatorId) matchQuery.operatorId = new mongoose.Types.ObjectId(operatorId);

    // 1. Summary
    const summary = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: null, totalTickets: { $sum: 1 }, totalRevenue: { $sum: '$price' }, avgTicketValue: { $avg: '$price' } } }
    ]);

    // 2. Voided count
    const voidedCount = await Ticket.countDocuments({ createdAt: { $gte: start, $lte: end }, isVoided: true, ...(operatorId ? { operatorId } : {}) });

    // 3. By ticket class
    const byClass = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$ticketClassId', count: { $sum: 1 }, revenue: { $sum: '$price' } } },
      { $lookup: { from: 'ticketclasses', localField: '_id', foreignField: '_id', as: 'ticketClass' } },
      { $unwind: '$ticketClass' },
      { $project: { ticketClass: { name:1, price:1, color:1 }, count:1, revenue:1 } },
      { $sort: { 'ticketClass.price': 1 } }
    ]);

    // 4. By operator
    const byOperator = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$operatorId', count: { $sum: 1 }, revenue: { $sum: '$price' }, avgValue: { $avg: '$price' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'operator' } },
      { $unwind: '$operator' },
      { $project: { operator: { name:1, username:1 }, count:1, revenue:1, avgValue:1 } },
      { $sort: { revenue: -1 } }
    ]);

    // 5. Daily trend
    const dailyTrend = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: { year: { $year:'$createdAt' }, month: { $month:'$createdAt' }, day: { $dayOfMonth:'$createdAt' } }, count: { $sum:1 }, revenue: { $sum:'$price' } } },
      { $sort: { '_id.year':1, '_id.month':1, '_id.day':1 } }
    ]);

    // 6. Hourly breakdown (tickets per hour of day)
    const hourlyBreakdown = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: { hour: { $hour: '$createdAt' } }, count: { $sum:1 }, revenue: { $sum:'$price' } } },
      { $sort: { '_id.hour': 1 } }
    ]);

    // 7. Peak hour
    const peakHour = hourlyBreakdown.reduce((peak, cur) => cur.count > (peak?.count || 0) ? cur : peak, null);

    // 8. Hourly avg per day (only for ranges > 1 day)
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    // 9. Top performing class
    const topClass = [...byClass].sort((a,b) => b.revenue - a.revenue)[0] || null;

    // 10. Revenue per ticket class percentage share
    const totalRev = summary[0]?.totalRevenue || 0;
    const byClassWithShare = byClass.map(c => ({
      ...c,
      share: totalRev > 0 ? Math.round((c.revenue / totalRev) * 100) : 0
    }));

    // 11. Weekday breakdown
    const weekdayBreakdown = await Ticket.aggregate([
      { $match: matchQuery },
      { $group: { _id: { dayOfWeek: { $dayOfWeek: '$createdAt' } }, count: { $sum:1 }, revenue: { $sum:'$price' } } },
      { $sort: { '_id.dayOfWeek': 1 } }
    ]);
    const DAYS = ['', 'Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const weekdayData = weekdayBreakdown.map(d => ({
      day: DAYS[d._id.dayOfWeek],
      count: d.count,
      revenue: d.revenue
    }));

    res.json({
      success: true,
      data: {
        summary: {
          ...(summary[0] || { totalTickets:0, totalRevenue:0, avgTicketValue:0 }),
          voidedCount,
          diffDays,
          avgPerDay: summary[0] ? Math.round(summary[0].totalTickets / diffDays) : 0,
          revenuePerDay: summary[0] ? Math.round(summary[0].totalRevenue / diffDays) : 0,
        },
        byClass: byClassWithShare,
        byOperator,
        dailyTrend,
        hourlyBreakdown,
        peakHour,
        weekdayData,
        topClass,
        dateRange: { start, end }
      }
    });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
};

exports.exportExcel = async (req, res) => {
  try {
    const { filter = 'daily', startDate, endDate, month, year, operatorId } = req.query;
    const { start, end } = getDateRange(filter, startDate, endDate, month, year);
    const mongoose = require('mongoose');

    const matchQuery = { createdAt: { $gte: start, $lte: end }, isVoided: false };
    if (operatorId) matchQuery.operatorId = new mongoose.Types.ObjectId(operatorId);

    const tickets = await Ticket.find(matchQuery)
      .populate('ticketClassId', 'name price')
      .populate('operatorId', 'name username')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ParkTicket System';
    workbook.created = new Date();

    const headerStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } }, alignment: { horizontal: 'center' } };
    const greenStyle = { font: { color: { argb: 'FF16A34A' }, bold: true } };

    // ── Sheet 1: Summary ─────────────────────────────────
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { key: 'metric', width: 30 },
      { key: 'value', width: 20 }
    ];
    summarySheet.addRow(['PARKING TICKET REPORT', '']).font = { bold: true, size: 14 };
    summarySheet.addRow([`Period: ${start.toDateString()} → ${end.toDateString()}`, '']).font = { italic: true, color: { argb: 'FF6B7280' } };
    summarySheet.addRow([]);
    const hdr = summarySheet.addRow(['Metric', 'Value']);
    hdr.eachCell(c => Object.assign(c, headerStyle));
    const totalRevenue = tickets.reduce((s,t) => s + t.price, 0);
    const rows = [
      ['Total Tickets Sold', tickets.length],
      ['Total Revenue (₹)', totalRevenue],
      ['Average Ticket Value (₹)', tickets.length ? (totalRevenue / tickets.length).toFixed(2) : 0],
      ['Report Generated', new Date().toLocaleString('en-IN')],
    ];
    rows.forEach(r => {
      const row = summarySheet.addRow(r);
      if (typeof r[1] === 'number' && r[0].includes('Revenue')) row.getCell(2).style = greenStyle;
    });

    // ── Sheet 2: All Tickets ─────────────────────────────
    const ticketsSheet = workbook.addWorksheet('All Tickets');
    ticketsSheet.columns = [
      { header: 'Sr No', key: 'sr', width: 8 },
      { header: 'Serial', key: 'serial', width: 10 },
      { header: 'Price (₹)', key: 'price', width: 12 },
      { header: 'Ticket Class', key: 'class', width: 20 },
      { header: 'Operator', key: 'operator', width: 20 },
      { header: 'Date', key: 'date', width: 14 },
      { header: 'Time', key: 'time', width: 12 },
    ];
    ticketsSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));
    tickets.forEach((t, i) => {
      const d = new Date(t.createdAt);
      ticketsSheet.addRow({
        sr: i + 1,
        serial: t.serialNumber,
        price: t.price,
        class: t.ticketClassId?.name || 'Unknown',
        operator: t.operatorId?.name || 'Unknown',
        date: d.toLocaleDateString('en-IN'),
        time: d.toLocaleTimeString('en-IN'),
      });
    });
    ticketsSheet.getColumn('price').numFmt = '₹#,##0';

    // ── Sheet 3: Class Breakdown ─────────────────────────
    const classSheet = workbook.addWorksheet('By Ticket Class');
    classSheet.columns = [
      { header: 'Class', key: 'class', width: 20 },
      { header: 'Price (₹)', key: 'price', width: 12 },
      { header: 'Tickets Sold', key: 'count', width: 15 },
      { header: 'Revenue (₹)', key: 'revenue', width: 15 },
      { header: 'Share %', key: 'share', width: 12 },
    ];
    classSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));
    const byClassMap = {};
    tickets.forEach(t => {
      const key = t.ticketClassId?._id?.toString();
      if (!byClassMap[key]) byClassMap[key] = { name: t.ticketClassId?.name, price: t.price, count: 0, revenue: 0 };
      byClassMap[key].count++;
      byClassMap[key].revenue += t.price;
    });
    Object.values(byClassMap).sort((a,b) => a.price - b.price).forEach(c => {
      classSheet.addRow({ class: c.name, price: c.price, count: c.count, revenue: c.revenue, share: totalRevenue ? `${Math.round(c.revenue/totalRevenue*100)}%` : '0%' });
    });

    // ── Sheet 4: Operator Breakdown ──────────────────────
    const opSheet = workbook.addWorksheet('By Operator');
    opSheet.columns = [
      { header: 'Operator', key: 'name', width: 22 },
      { header: 'Username', key: 'username', width: 16 },
      { header: 'Tickets Sold', key: 'count', width: 15 },
      { header: 'Revenue (₹)', key: 'revenue', width: 15 },
    ];
    opSheet.getRow(1).eachCell(c => Object.assign(c, headerStyle));
    const byOpMap = {};
    tickets.forEach(t => {
      const key = t.operatorId?._id?.toString();
      if (!byOpMap[key]) byOpMap[key] = { name: t.operatorId?.name, username: t.operatorId?.username, count: 0, revenue: 0 };
      byOpMap[key].count++;
      byOpMap[key].revenue += t.price;
    });
    Object.values(byOpMap).sort((a,b) => b.revenue - a.revenue).forEach(op => {
      opSheet.addRow(op);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=parking-report-${Date.now()}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export' });
  }
};
