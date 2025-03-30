import Swal from "sweetalert2";

const visualizarPDF = (ordem, numero) => {
  if (!ordem) {
    console.error("Erro: Ordem não foi fornecida para visualização.");
    return;
  }

  if (!numero) {
    numero = localStorage.getItem("numeroOrdem");
  }

  if (!numero) {
    console.error("Número da Ordem não encontrado!");
    return;
  }

  console.log("Visualizando Ordem:", numero);

  const endereco = ordem.cliente?.endereco
    ? `${ordem.cliente.endereco.rua || ""}, ${ordem.cliente.endereco.numero || ""} - ${ordem.cliente.endereco.bairro || ""}, ${ordem.cliente.endereco.cidade || ""} - ${ordem.cliente.endereco.estado || ""}, ${ordem.cliente.endereco.cep || ""}`
    : "Endereço não informado";

  const itensLista = ordem.itens
    ? ordem.itens.map(
        (item) =>
          `<li>${item.nome || "Não informado"} - ${item.quantidade || "0"} un. - R$ ${(item.valorTotal || 0).toFixed(2)}</li>`
      )
    : [];

  const valorTotal = ordem.itens
    ? ordem.itens.reduce((total, item) => total + (item.valorTotal || 0), 0).toFixed(2)
    : "0.00";

  Swal.fire({
    title: `Ordem de Serviço #${numero}`,
    html: `
      <strong>Cliente:</strong> ${ordem.cliente?.nome || "Não informado"}<br/>
      <strong>CPF/CNPJ:</strong> ${ordem.cliente?.cpfCnpj || "Não informado"}<br/>
      <strong>Telefone:</strong> ${ordem.cliente?.telefone || "Não informado"}<br/>
      <strong>Endereço:</strong> ${endereco}<br/>
      <strong>Tipo de Pedido:</strong> ${ordem.tipoPedido || "Não informado"}<br/>
      <strong>Método de Pagamento:</strong> ${ordem.metodoPagamento || "Não informado"}<br/>
      <strong>Status de Pagamento:</strong> ${ordem.statusPagamento || "Não informado"}<br/>
      <hr/>
      <strong>Itens do Pedido:</strong>
      <ul style="text-align: left;">${itensLista.join("") || "<li>Nenhum item</li>"}</ul>
      <hr/>
      <strong>Valor Total:</strong> R$ ${valorTotal}
    `,
    icon: "info",
    confirmButtonText: "Fechar",
  });

  localStorage.removeItem("numeroOrdem");
};

export default visualizarPDF;
