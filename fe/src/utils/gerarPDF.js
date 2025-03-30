import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const gerarPDF = (ordem, numero) => {
  if (!ordem) {
    console.error("Erro: Ordem não foi fornecida para gerarPDF.");
    return;
  }

  if (!numero) {
    numero = localStorage.getItem("numeroOrdem");
  }

  if (!numero) {
    console.error("Número da Ordem não encontrado!");
    return;
  }

  console.log("Gerando PDF para a Ordem:", numero);

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Ordem de Serviço", 10, 10);

  doc.setFontSize(12);
  doc.text(`Número da Ordem: ${numero}`, 10, 20);
  doc.text(`Cliente: ${ordem.cliente?.nome || "Não informado"}`, 10, 30);
  doc.text(`CPF/CNPJ: ${ordem.cliente?.cpfCnpj || "Não informado"}`, 10, 40);
  doc.text(`Telefone: ${ordem.cliente?.telefone || "Não informado"}`, 10, 50);

  const endereco = ordem.cliente?.endereco
    ? `${ordem.cliente.endereco.rua || ""}, ${ordem.cliente.endereco.numero || ""} - ${ordem.cliente.endereco.bairro || ""}, ${ordem.cliente.endereco.cidade || ""} - ${ordem.cliente.endereco.estado || ""}, ${ordem.cliente.endereco.cep || ""}`
    : "Endereço não informado";

  doc.text(`Endereço: ${endereco}`, 10, 60);
  doc.text(`Tipo de Pedido: ${ordem.tipoPedido || "Não informado"}`, 10, 70);
  doc.text(`Método de Pagamento: ${ordem.metodoPagamento || "Não informado"}`, 10, 80);
  doc.text(`Status de Pagamento: ${ordem.statusPagamento || "Não informado"}`, 10, 90);

  const colunas = ["Nome do Serviço", "Quantidade", "Valor Unitário", "Valor Total"];
  const corpoTabela = ordem.itens
    ? ordem.itens.map((item) => [
        item.nome || "Não informado",
        item.quantidade || "0",
        `R$ ${(item.valorUnitario || 0).toFixed(2)}`,
        `R$ ${(item.valorTotal || 0).toFixed(2)}`,
      ])
    : [];

  autoTable(doc, {
    startY: 100,
    head: [colunas],
    body: corpoTabela,
  });

  doc.text(
    `Valor Total: R$ ${ordem.itens ? ordem.itens.reduce((total, item) => total + (item.valorTotal || 0), 0).toFixed(2) : "0.00"}`,
    10,
    doc.lastAutoTable.finalY + 10
  );

  doc.save(`Ordem_${numero}.pdf`);

  localStorage.removeItem("numeroOrdem");
};

export default gerarPDF;
