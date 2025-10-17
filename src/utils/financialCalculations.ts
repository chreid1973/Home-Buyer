// This file can be used for any client-side financial calculations if needed.
// For example, calculating mortgage payments.

/**
 * Calculates the monthly mortgage payment.
 * @param principal The total loan amount.
 * @param annualRate The annual interest rate (e.g., 5 for 5%).
 * @param years The loan term in years.
 * @returns The monthly payment amount.
 */
export function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate < 0 || years <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
}
