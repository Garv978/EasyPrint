function calculateDocumentPrice({
  pages,
  printOptions,
  bwRate,
  colorRate,
}) {
  const copies = Number(printOptions.copies) || 1;

  const rate =
    printOptions.color === "Color"
      ? Number(colorRate)
      : Number(bwRate);

  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error("Invalid shop pricing");
  }

  const totalPages = pages * copies;

  return totalPages * rate;
}

function calculateJobPrice({
  documents,
  printOptions,
  bwRate,
  colorRate,
}) {
  let totalPrice = 0;

  const pricedDocuments = documents.map((document) => {
    const price = calculateDocumentPrice({
      pages: document.chargedPages,
      printOptions,
      bwRate,
      colorRate,
    });

    totalPrice += price;

    return {
      ...document,
      price,
    };
  });

  return {
    totalPrice,
    documents: pricedDocuments,
  };
}

module.exports = calculateJobPrice;