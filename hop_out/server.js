import app from "./backend/index.js";
import * as db from "./backend/data/db.js";

//db.connect(process.env.TEST_DB)
db.connect(process.env.DB);
const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`HopOut API at http://localhost:${PORT}/`);
});