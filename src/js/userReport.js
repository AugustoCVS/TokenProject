"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem('userId');
    function createUserMarketReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const sectionMarketReport = document.getElementById("sectionMarketReport");
            const response = yield fetch("http://localhost:3000/relatorio");
            const report_list = yield response.json();
            sectionMarketReport.innerHTML = "";
            for (const report of report_list) {
                const idTokenReport = report.idTokenReport;
                if (userId === idTokenReport) {
                    const reportHTML = `
            <div class="report">
              <h3 class="report-title">Relatório de Compras</h3>
              <div class="report-info">
                <p><span class="label">Token:</span> <span class="value">${report.title}</span></p>
                <p><span class="label">Preço:</span> <span class="value price">R$${report.price},00</span></p>
                <p><span class="label">Quantidade:</span> <span class="value amount">${report.amount}</span></p>
              </div>
            </div>
          `;
                    sectionMarketReport.insertAdjacentHTML("beforeend", reportHTML);
                }
            }
        });
    }
    window.addEventListener("load", createUserMarketReport);
});
