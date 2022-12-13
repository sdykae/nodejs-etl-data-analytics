export interface TransactionReport {
  name: string; // The customer’s name.
  username: string; // The customer’s username.
  sell_count: number; // The total sale transactions made.
  buy_count: number; // The total purchase transactions made.
  min_investment: number; // Minimum investment ever made in a company.
  max_investment: number; // Maximum investment ever made in a company.
  total_stock: number; // Total number of stock the customer has.
}
