document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem('userId');
  
    async function createUserMarketReport(): Promise<void> {
      const sectionMarketReport = document.getElementById(
        "sectionMarketReport"
      ) as HTMLElement;
  
      const response = await fetch("http://localhost:3000/relatorio");
      const report_list = await response.json();
  
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
    }
  
    window.addEventListener("load", createUserMarketReport);
  });
  