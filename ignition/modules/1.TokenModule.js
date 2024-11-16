const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
require("dotenv").config();

module.exports = buildModule("TokenModule", (m) => {
    const tokenName = m.getParameter("tokenName", process.env.PESW_TOKEN_NAME);
    const tokenSymbol = m.getParameter("tokenSymbol", process.env.PESW_TOKEN_SYMBOL);
    const initialSupply = m.getParameter("initialSupply", process.env.PESW_TOKEN_TOTAL_SUPPLY);

    // deploy token contract
    // 1. Presale token
    const token = m.contract("Token", [
        tokenName,
        tokenSymbol,
        initialSupply,
    ]);

    return { token };
});
