const db = require('../database/database');
const csv = require('csv-parser');
const fs = require('fs');

exports.uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach((row) => {
        db.run(
          `INSERT INTO products (campaign_id, campaign_name, ad_group_id, fsn_id, product_name, ad_spend, views, clicks, direct_units, indirect_units, direct_revenue, indirect_revenue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
          [
            row['Campaign ID'],
            row['Campaign Name'],
            row['Ad Group ID'],
            row['FSN ID'],
            row['Product Name'],
            row['Ad Spend'],
            row['Views'],
            row['Clicks'],
            row['Direct Units'],
            row['Indirect Units'],
            row['Direct Revenue'],
            row['Indirect Revenue'],
          ]
        );
      });
      res.status(200).json({ message: 'CSV uploaded and data stored in database.' });
    });
};

exports.reportByCampaign = (req, res) => {
  const { campaign_name, ad_group_id, fsn_id, product_name } = req.body;
  const conditions = [];
  const values = [];

  if (campaign_name) {
    conditions.push('campaign_name = ?');
    values.push(campaign_name);
  }

  if (ad_group_id) {
    conditions.push('ad_group_id = ?');
    values.push(ad_group_id);
  }

  if (fsn_id) {
    conditions.push('fsn_id = ?');
    values.push(fsn_id);
  }

  if (product_name) {
    conditions.push('product_name = ?');
    values.push(product_name);
  }
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const per_page = req.query.per_page ? parseInt(req.query.per_page, 10) : 10;
  
  const limit = parseInt(per_page, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  db.all(`SELECT * FROM products ${whereClause} LIMIT ? OFFSET ?`, [...values, limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving data' });
    }

    const reportData = rows.map(row => ({
      campaign_name: row.campaign_name,
      ad_spend: row.ad_spend,
      views: row.views,
      clicks: row.clicks,
      ctr: (row.clicks / row.views) * 100,
      total_revenue: row.direct_revenue + row.indirect_revenue,
      total_orders: row.direct_units + row.indirect_units,
      roas: (row.direct_revenue + row.indirect_revenue) / row.ad_spend
    }));
    if (reportData.length) {
      res.json({ data: reportData, message: "Reports fetched successfully" }).status(200);
    } else {
      res.json({ data: reportData, message: "No data found" }).status(200);
    }
  });
};
