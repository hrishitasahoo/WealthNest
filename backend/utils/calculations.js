

function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

function calculateSIP({ monthlyInvestment, annualReturnPercent, years }) {
  const P = Number(monthlyInvestment);
  const n = Math.round(Number(years) * 12);
  const i = Number(annualReturnPercent) / 100 / 12;

  let futureValue;
  if (i === 0) {
    futureValue = P * n;
  } else {
    futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }

  const totalInvested = P * n;
  const estimatedReturns = futureValue - totalInvested;

  return {
    totalInvested: round2(totalInvested),
    estimatedReturns: round2(estimatedReturns),
    estimatedFinalValue: round2(futureValue),
    months: n
  };
}

function calculateFD({ principal, annualRatePercent, years, compoundingPerYear }) {
  const P = Number(principal);
  const r = Number(annualRatePercent) / 100;
  const t = Number(years);
  const n = Number(compoundingPerYear) || 1;

  const maturity = P * Math.pow(1 + r / n, n * t);
  const interest = maturity - P;

  return {
    principal: round2(P),
    estimatedInterest: round2(interest),
    estimatedMaturityAmount: round2(maturity)
  };
}

function calculateCompoundInterest({ principal, annualRatePercent, years, compoundingPerYear }) {
  const result = calculateFD({
    principal,
    annualRatePercent,
    years,
    compoundingPerYear
  });
  return {
    principal: result.principal,
    interestEarned: result.estimatedInterest,
    finalAmount: result.estimatedMaturityAmount
  };
}

function calculateSavingsGoal({ targetAmount, currentSavings, targetDate, monthlyContribution }) {
  const target = Number(targetAmount);
  const current = Number(currentSavings);
  const contribution = Number(monthlyContribution);

  const remaining = Math.max(target - current, 0);

  const now = new Date();
  const end = new Date(targetDate);
  let monthsRemaining = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  if (monthsRemaining < 1) monthsRemaining = 1;

  const requiredMonthlyContribution = remaining > 0 ? remaining / monthsRemaining : 0;
  const progressPercent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isContributionSufficient = contribution >= requiredMonthlyContribution || remaining <= 0;

  return {
    amountRemaining: round2(remaining),
    monthsRemaining,
    requiredMonthlyContribution: round2(requiredMonthlyContribution),
    progressPercent: round2(progressPercent),
    isContributionSufficient
  };
}

function buildSIPGrowthSeries({ monthlyInvestment, annualReturnPercent, years }) {
  const series = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const partial = calculateSIP({
      monthlyInvestment,
      annualReturnPercent,
      years: Math.min(y, years)
    });
    series.push({ year: y, value: partial.estimatedFinalValue });
  }
  return series;
}

function buildCompoundGrowthSeries({ principal, annualRatePercent, years, compoundingPerYear }) {
  const series = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const partial = calculateCompoundInterest({
      principal,
      annualRatePercent,
      years: Math.min(y, years),
      compoundingPerYear
    });
    series.push({ year: y, value: partial.finalAmount });
  }
  return series;
}

module.exports = {
  round2,
  calculateSIP,
  calculateFD,
  calculateCompoundInterest,
  calculateSavingsGoal,
  buildSIPGrowthSeries,
  buildCompoundGrowthSeries
};
