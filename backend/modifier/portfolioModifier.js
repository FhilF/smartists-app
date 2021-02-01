export const portfolioModifier = (_portfolios) => {
    const portfolios = [..._portfolios];
    portfolios.forEach((portfolio, index) => {
      const _portfolio = {
        ...portfolio,
      };
  
      delete _portfolio.signingKeyId;
      delete _portfolio.radiksSignature;
      portfolios[index] = _portfolio;
    });
    return portfolios;
  };