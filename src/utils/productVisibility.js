// src/utils/productVisibility.js
export function getProductVisibility(p) {
    const issues = [];

    const active = p?.active !== false;
    if (!active) issues.push("Inactive");

    const nameOk = (p?.name || "").trim().length > 0;
    if (!nameOk) issues.push("Missing name");

    const priceNum = Number(p?.price);
    const priceOk = Number.isFinite(priceNum) && priceNum > 0;
    if (!priceOk) issues.push("Price must be > 0");

    const gallery0 = Array.isArray(p?.gallery) ? (p.gallery[0] || "") : "";
    const hero = (p?.image || gallery0 || "").trim();
    const imageOk = hero.length > 0;
    if (!imageOk) issues.push("Missing image");

    const fulfillment = (p?.fulfillment || "ready").trim();

    if (fulfillment === "ready") {
        const qtyNum = Number(p?.qty);
        const qtyOk = Number.isFinite(qtyNum) && qtyNum >= 1;
        if (!qtyOk) issues.push("Ready-to-ship needs qty >= 1");
    } else if (fulfillment === "made") {
        const leadNum = Number(p?.leadDays);
        const leadOk = Number.isFinite(leadNum) && leadNum >= 0;
        if (!leadOk) issues.push("Made-to-order needs leadDays >= 0");
    } else {
        issues.push("Fulfillment must be ready|made");
    }

    return { visible: issues.length === 0, issues, hero };
}
