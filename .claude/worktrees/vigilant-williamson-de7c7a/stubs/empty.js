// Stub kosong untuk mem-bypass modul server-only (mis. stimulsoft-data-adapter
// dan DB driver-nya: mongodb, mysql2, oracledb, pg, tedious) agar tidak
// ter-bundle ke browser oleh Turbopack. Report di-render dari JSON, jadi
// adapter database ini tidak pernah dipakai di sisi client.
module.exports = {};
