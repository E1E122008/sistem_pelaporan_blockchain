const crypto = require('crypto');
function hashReportData(violenceType, location, relationWithPerpetrator, date, fileName) {
  const dataString = `${violenceType}|${location}|${relationWithPerpetrator}|${date}|${fileName}`;
  return crypto.createHash('sha256').update(dataString).digest('hex');
}
module.exports = { hashReportData };
