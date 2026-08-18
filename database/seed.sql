USE wealthnest;

INSERT INTO users (full_name, username, email, password_hash, preferred_language)
VALUES (
  'Ananya Sharma',
  'ananya',
  'demo@wealthnest.in',
  '$2b$10$p7q7o3xyDWByxT2g6a9/X.0RW5fPo4LvHrH1U1cOFCe7IOBf1dxe.',
  'en'
);

INSERT INTO financial_profiles
  (user_id, age, monthly_income, monthly_expenses, current_savings, existing_investments, monthly_saving_capacity, main_financial_goal)
VALUES
  (1, 27, 30000.00, 21000.00, 45000.00, 20000.00, 9000.00, 'Build an emergency fund and start investing');

INSERT INTO financial_goals (user_id, goal_name, goal_type, target_amount, current_amount, target_date, monthly_contribution)
VALUES
  (1, 'Emergency Fund', 'Emergency Fund', 50000.00, 30000.00, '2026-12-31', 5000.00),
  (1, 'New Laptop', 'Laptop', 60000.00, 15000.00, '2027-03-31', 4000.00);

INSERT INTO budget_entries (user_id, category, amount, payment_method, description, note, entry_date) VALUES
  (1, 'Rent', 9000.00, 'Net Banking', 'Monthly room rent', NULL, '2026-08-01'),
  (1, 'Groceries', 3200.00, 'UPI', 'Monthly groceries', NULL, '2026-08-02'),
  (1, 'Food', 1800.00, 'UPI', 'Eating out with friends', NULL, '2026-08-03'),
  (1, 'Transport', 1500.00, 'Cash', 'Bus pass and auto fares', NULL, '2026-08-04'),
  (1, 'Bills', 2000.00, 'UPI', 'Electricity and mobile recharge', NULL, '2026-08-05'),
  (1, 'Entertainment', 1200.00, 'Credit Card', 'Movies and OTT subscription', NULL, '2026-08-08'),
  (1, 'Shopping', 2300.00, 'Debit Card', 'Clothes', NULL, '2026-08-10'),
  (1, 'Healthcare', 900.00, 'UPI', 'Pharmacy', NULL, '2026-08-12');

INSERT INTO budget_plans
  (user_id, monthly_income, city, family_size, dependents, recurring_expenses, savings_target, needs_percent, wants_percent, savings_percent)
VALUES
  (1, 30000.00, 'Pune', 1, 0, 12500.00, 9000.00, 54.00, 16.00, 30.00);

INSERT INTO savings_entries (user_id, goal_id, amount, entry_date, description) VALUES
  (1, 1, 5000.00, '2026-06-05', 'Monthly contribution to emergency fund'),
  (1, 1, 5000.00, '2026-07-05', 'Monthly contribution to emergency fund'),
  (1, 1, 5000.00, '2026-08-05', 'Monthly contribution to emergency fund'),
  (1, 2, 3000.00, '2026-06-10', 'Savings towards new laptop'),
  (1, 2, 4000.00, '2026-07-10', 'Savings towards new laptop'),
  (1, 2, 4000.00, '2026-08-10', 'Savings towards new laptop');

INSERT INTO financial_schemes
(scheme_name, category, purpose, intended_for, eligibility, key_benefits, limitations, official_source, official_url, last_verified_date)
VALUES
('Public Provident Fund (PPF)', 'Savings',
 'A long-term government-backed savings scheme that offers guaranteed, tax-free returns.',
 'Indian residents looking for safe, long-term savings and retirement planning.',
 'Any resident Indian individual can open an account. Minors can have an account opened by a guardian.',
 'Guaranteed interest set quarterly by the government; investment, interest and maturity amount are all tax-exempt; can be used as collateral for loans after a few years.',
 '15-year lock-in period; partial withdrawals allowed only after the 7th year; maximum deposit of Rs. 1.5 lakh per financial year.',
 'National Savings Institute, Ministry of Finance (nsiindia.gov.in)',
 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=55',
 '2026-01-15'),

('Sukanya Samriddhi Yojana (SSY)', 'Women',
 'A savings scheme aimed at securing the financial future of a girl child.',
 'Parents or legal guardians of a girl child below 10 years of age.',
 'Account can be opened for a girl child from birth until she turns 10; only one account is allowed per girl child (with a maximum of two accounts per family in most cases).',
 'High, government-declared interest rate; tax benefits on deposits and maturity; account matures when the girl turns 21 or on marriage after 18.',
 'Minimum annual deposit required to keep the account active; premature closure allowed only in specific circumstances.',
 'India Post / Ministry of Finance (nsiindia.gov.in)',
 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=89',
 '2026-01-15'),

('Atal Pension Yojana (APY)', 'Pension',
 'A government pension scheme that provides a fixed monthly pension after the age of 60.',
 'Workers in the unorganised sector who want guaranteed retirement income.',
 'Indian citizens aged 18 to 40 with a savings bank account; not covered under any statutory social security scheme.',
 'Guaranteed monthly pension of Rs. 1,000 to Rs. 5,000 depending on contribution; government co-contribution for eligible early subscribers.',
 'Pension amount depends on the age of joining and contribution amount; premature exit is restricted except in special cases.',
 'Pension Fund Regulatory and Development Authority (npscra.nsdl.co.in)',
 'https://npscra.nsdl.co.in/scheme-details.php',
 '2026-01-10'),

('National Pension System (NPS)', 'Pension',
 'A voluntary, market-linked retirement savings scheme regulated by the government.',
 'Any individual, including salaried and self-employed people, planning for retirement.',
 'Indian citizens aged 18 to 70 can open an NPS account.',
 'Additional tax deduction available on contributions; choice of investment mix between equity and debt; portable across jobs and locations.',
 'Returns are market-linked and not guaranteed; partial withdrawal before retirement is restricted; a portion of the corpus must be used to buy an annuity at retirement.',
 'Pension Fund Regulatory and Development Authority (npscra.nsdl.co.in)',
 'https://npscra.nsdl.co.in',
 '2026-01-10'),

('Pradhan Mantri Jan Dhan Yojana (PMJDY)', 'Savings',
 'A financial inclusion scheme that provides access to basic banking services.',
 'Unbanked individuals, especially in rural and semi-urban areas.',
 'Any Indian citizen without a bank account; simplified KYC available for small accounts.',
 'Zero-balance savings account; free RuPay debit card; accident insurance cover; access to overdraft facility after satisfactory account operation.',
 'Overdraft and insurance benefits may have conditions and are not automatic from day one.',
 'Department of Financial Services, Ministry of Finance (pmjdy.gov.in)',
 'https://pmjdy.gov.in',
 '2026-01-12'),

('Sovereign Gold Bond (SGB) Scheme', 'Savings',
 'A government security denominated in grams of gold, offered as an alternative to holding physical gold.',
 'Individuals who want gold exposure without the risks of physical storage.',
 'Resident individuals, HUFs, trusts and certain institutions can invest, subject to RBI-notified issue windows.',
 'Interest paid on the invested amount in addition to potential gold price appreciation; capital gains at maturity are tax-exempt for individuals.',
 'Available only during specific issue windows announced by the RBI; 8-year tenure with early exit allowed only after the 5th year on interest payment dates.',
 'Reserve Bank of India (rbi.org.in)',
 'https://www.rbi.org.in/Scripts/FAQView.aspx?Id=109',
 '2026-01-08'),

('Pradhan Mantri Suraksha Bima Yojana (PMSBY)', 'Insurance',
 'A low-cost accidental death and disability insurance scheme.',
 'Individuals aged 18 to 70 with a bank account, seeking affordable accident cover.',
 'Bank account holders in the specified age group who give consent for auto-debit of the annual premium.',
 'Very low annual premium; cover for accidental death and permanent/partial disability.',
 'Cover is limited to accidental death and disability only, not natural death or illness; must be renewed annually.',
 'Department of Financial Services, Ministry of Finance (jansuraksha.gov.in)',
 'https://www.jansuraksha.gov.in/Forms-PMSBY.aspx',
 '2026-01-12'),

('Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)', 'Insurance',
 'An affordable term life insurance scheme offering life cover.',
 'Individuals aged 18 to 50 with a bank account, seeking basic life insurance.',
 'Bank account holders in the specified age group who give consent for auto-debit of the annual premium.',
 'Affordable annual premium; life cover in case of death due to any reason.',
 'Cover ends at age 55 unless renewed; lapses if premium is not paid on time.',
 'Department of Financial Services, Ministry of Finance (jansuraksha.gov.in)',
 'https://www.jansuraksha.gov.in/Forms-PMJJBY.aspx',
 '2026-01-12'),

('Kisan Credit Card (KCC)', 'Farmers',
 'A credit scheme that provides farmers with timely access to affordable credit.',
 'Farmers, including tenant farmers and sharecroppers, needing working capital for agriculture.',
 'Farmers engaged in crop production, animal husbandry or fisheries, subject to bank assessment.',
 'Short-term credit at concessional interest rates; flexible repayment aligned with harvest cycles; interest subvention for prompt repayment.',
 'Credit limit depends on land holding and crop pattern; interest subvention benefits require timely repayment.',
 'Department of Financial Services / NABARD (nabard.org)',
 'https://www.nabard.org/content1.aspx?id=591&catid=23&mid=530',
 '2026-01-09'),

('National Scholarship Portal Schemes', 'Students',
 'A single-window platform offering various government scholarships for students.',
 'School and college students, especially from economically weaker or underrepresented backgrounds.',
 'Eligibility varies by individual scholarship scheme; generally based on family income, academic performance and category.',
 'Financial assistance for tuition fees, maintenance allowance and other education-related costs, depending on the specific scholarship.',
 'Each scholarship has its own eligibility, deadlines and renewal conditions; delays in disbursement can occur.',
 'National Scholarship Portal, Ministry of Education (scholarships.gov.in)',
 'https://scholarships.gov.in',
 '2026-01-11'),

('Credit Guarantee Fund Scheme for Micro and Small Enterprises (CGTMSE)', 'Small Businesses',
 'A scheme that provides collateral-free credit to micro and small enterprises.',
 'Micro and small business owners who need funding but lack sufficient collateral.',
 'New and existing micro and small enterprises as defined under the MSME Act, availing credit through eligible lending institutions.',
 'Collateral-free loans up to a specified limit; guarantee cover reduces the lender risk, improving loan approval chances.',
 'Guarantee fee applies; coverage percentage and loan limits vary based on enterprise category.',
 'Ministry of MSME (cgtmse.in)',
 'https://www.cgtmse.in',
 '2026-01-13'),

('Pradhan Mantri Mudra Yojana (PMMY)', 'Small Businesses',
 'A scheme offering collateral-free loans to small and micro business owners.',
 'Non-corporate, non-farm small and micro entrepreneurs.',
 'Any Indian citizen with a viable business plan for a non-farm income-generating activity, borrowing up to the scheme limit.',
 'Loans categorized as Shishu, Kishor and Tarun based on the stage of business; no collateral required.',
 'Loan amount is capped; approval depends on the lending institution assessment of the business plan.',
 'Ministry of Finance / MUDRA (mudra.org.in)',
 'https://www.mudra.org.in',
 '2026-01-13');

INSERT INTO learning_topics (slug, title, category, simple_explanation, example_text, key_points, display_order) VALUES

('start-saving', 'How to Start Saving', 'Basics',
 'Saving means keeping aside a part of the money you earn instead of spending all of it. A simple way to start is to decide a fixed amount or percentage of your income to save every month, before you spend on anything else.',
 'If you earn Rs. 20,000 a month and decide to save 20%, you would set aside Rs. 4,000 as soon as you receive your salary, and manage the remaining Rs. 16,000 for expenses.',
 JSON_ARRAY(
   'Save first, spend later - do not wait for leftover money at month-end.',
   'Start small if needed; consistency matters more than the amount.',
   'Keep savings in a separate account so you are not tempted to spend it.',
   'Review and increase your saving amount as your income grows.'
 ), 1),

('what-is-fd', 'What is an FD?', 'Products',
 'FD stands for Fixed Deposit. It is a savings option offered by banks where you deposit a lump sum of money for a fixed period and earn a fixed rate of interest on it.',
 'If you deposit Rs. 50,000 in an FD for 1 year at 7% interest, you would receive approximately Rs. 53,500 at the end of the year, depending on the compounding method used.',
 JSON_ARRAY(
   'The interest rate is fixed at the time of deposit.',
   'Withdrawing before the tenure ends may attract a penalty.',
   'FDs are considered a low-risk savings option.',
   'Interest earned on an FD is taxable as per your income tax slab.'
 ), 2),

('what-is-rd', 'What is an RD?', 'Products',
 'RD stands for Recurring Deposit. Instead of depositing a lump sum, you deposit a fixed amount every month for a chosen period, and the bank pays interest on the total accumulated amount.',
 'If you deposit Rs. 2,000 every month in an RD for 12 months at 6.5% interest, you would receive a maturity amount slightly higher than Rs. 24,000 (the total you deposited), due to the interest earned.',
 JSON_ARRAY(
   'Useful for people who want to save a fixed amount monthly rather than all at once.',
   'The interest rate is usually fixed for the entire tenure.',
   'Premature withdrawal may reduce the interest earned or attract a penalty.',
   'Good option for short and medium-term savings goals.'
 ), 3),

('what-is-sip', 'What is SIP?', 'Products',
 'SIP stands for Systematic Investment Plan. It is a method of investing a fixed amount regularly (usually monthly) into a mutual fund, instead of investing a large amount at once.',
 'If you invest Rs. 2,000 every month through a SIP for 5 years, you would invest a total of Rs. 1,20,000. Depending on market performance, the final value could be higher or lower than the invested amount.',
 JSON_ARRAY(
   'SIP helps build a disciplined, regular investing habit.',
   'Returns from mutual funds are market-linked and not guaranteed.',
   'Investing regularly can average out the impact of market ups and downs over time.',
   'SIP amounts can usually be started, paused or increased with flexibility.',
   'Mutual fund investments are subject to market risk - read scheme documents carefully.'
 ), 4),

('what-is-ppf', 'What is PPF?', 'Products',
 'PPF stands for Public Provident Fund, a long-term government-backed savings scheme designed mainly for retirement and long-term goals, offering guaranteed and tax-free returns.',
 'If you invest Rs. 1,000 every month in a PPF account, over 15 years you would have deposited Rs. 1,80,000, and the account would grow further with the interest earned, which is announced by the government every quarter.',
 JSON_ARRAY(
   'PPF has a lock-in period of 15 years.',
   'The interest rate is set by the government and reviewed quarterly.',
   'Investment, interest and maturity amount are all tax-exempt.',
   'Partial withdrawals are allowed only after a few years, under specific conditions.'
 ), 5),

('what-is-nps', 'What is NPS?', 'Products',
 'NPS stands for National Pension System, a voluntary retirement savings scheme where your money is invested in a mix of equity, corporate bonds and government securities to build a retirement corpus.',
 'If you contribute Rs. 5,000 every month to NPS starting at age 30, by the time you retire at 60, you would have contributed Rs. 18,00,000, and the final corpus would also include investment growth over the years.',
 JSON_ARRAY(
   'Returns are market-linked and not guaranteed.',
   'You can choose how your contribution is split between equity and debt.',
   'A portion of the final corpus must be used to purchase an annuity for regular pension income.',
   'Withdrawals before retirement are restricted except in specific situations.'
 ), 6),

('what-are-mutual-funds', 'What are Mutual Funds?', 'Products',
 'A mutual fund pools money from many investors and invests it in a mix of assets such as stocks, bonds or other securities, managed by a professional fund manager.',
 'If 1,000 people each invest Rs. 1,000 in the same mutual fund, that Rs. 10,00,000 is invested together in the market, and each investor owns a small proportional share of the total fund based on how much they put in.',
 JSON_ARRAY(
   'Mutual funds are managed by professional fund managers.',
   'Returns are not guaranteed and depend on market performance.',
   'Different fund types carry different levels of risk - equity funds are typically riskier than debt funds.',
   'It is possible to invest through a lump sum or through a SIP.',
   'Mutual fund investments are subject to market risk.'
 ), 7),

('what-is-inflation', 'What is Inflation?', 'Concepts',
 'Inflation is the gradual increase in the price of goods and services over time, which reduces the purchasing power of your money.',
 'If a cup of tea costs Rs. 10 today and inflation is 6% per year, the same cup of tea could cost approximately Rs. 10.60 next year and around Rs. 17.90 in ten years.',
 JSON_ARRAY(
   'Money that is not invested or saved productively can lose value over time due to inflation.',
   'Inflation is one reason to consider investments that can potentially grow faster than the inflation rate.',
   'Government agencies track and publish inflation rates regularly.',
   'Planning for long-term goals should account for the effect of inflation.'
 ), 8),

('emergency-fund', 'What is an Emergency Fund?', 'Concepts',
 'An emergency fund is money set aside specifically to cover unexpected expenses, such as a medical emergency, job loss or urgent repair, without disturbing your other savings or investments.',
 'If your monthly expenses are Rs. 15,000, a commonly suggested emergency fund would be Rs. 45,000 to Rs. 90,000, covering roughly 3 to 6 months of expenses.',
 JSON_ARRAY(
   'Keep the emergency fund in an easily accessible account, not locked in a long-term investment.',
   'A common guideline is to save 3 to 6 months of expenses.',
   'Use this fund only for genuine emergencies, not planned expenses.',
   'Rebuild the fund as soon as possible after using it.'
 ), 9),

('compound-interest', 'What is Compound Interest?', 'Concepts',
 'Compound interest is interest calculated on both the original amount you invested and the interest that has already been added to it, which means your money can grow faster over time compared to simple interest.',
 'If you invest Rs. 10,000 at 8% annual compound interest, after 1 year you would have Rs. 10,800. In the second year, interest is calculated on Rs. 10,800, not just the original Rs. 10,000, giving you Rs. 11,664.',
 JSON_ARRAY(
   'The longer your money stays invested, the more compounding can work in your favour.',
   'Compounding can work against you too, such as with unpaid credit card interest.',
   'Starting early, even with small amounts, can make a meaningful difference over time.',
   'Compounding frequency (yearly, half-yearly, monthly) affects the final amount.'
 ), 10),

('credit-score', 'What is a Credit Score?', 'Concepts',
 'A credit score is a number, usually between 300 and 900 in India, that represents how reliably you have repaid borrowed money in the past. Banks and lenders use it to decide whether to approve your loan or credit card application.',
 'A person who has consistently paid credit card bills and loan EMIs on time is likely to have a higher credit score, such as 750 or above, compared to someone who has missed payments.',
 JSON_ARRAY(
   'Paying EMIs and credit card bills on time helps maintain a good score.',
   'Using too much of your available credit limit can lower your score.',
   'You can check your credit score through authorized credit bureaus.',
   'A good credit score can help you get loans approved faster and at better interest rates.'
 ), 11),

('understanding-loans', 'Understanding Loans', 'Concepts',
 'A loan is money borrowed from a bank or lender that you agree to repay over time, usually with added interest. Loans are commonly used for education, homes, vehicles or personal needs.',
 'If you take a loan of Rs. 1,00,000 at 10% annual interest for 1 year, you would repay more than Rs. 1,00,000 in total, with the extra amount being the interest charged for borrowing the money.',
 JSON_ARRAY(
   'Understand the interest rate, tenure and total repayment amount before borrowing.',
   'EMI (Equated Monthly Instalment) is the fixed monthly amount you repay.',
   'Missing EMI payments can affect your credit score and may attract penalties.',
   'Compare loan offers from multiple lenders before deciding.'
 ), 12),

('understanding-insurance', 'Understanding Insurance', 'Concepts',
 'Insurance is a way to protect yourself financially against unexpected events, such as illness, accidents or death, by paying a smaller regular amount called a premium in exchange for financial protection.',
 'If you pay a life insurance premium of Rs. 5,000 per year for a cover of Rs. 10,00,000, your family would receive that cover amount if something were to happen to you during the policy period.',
 JSON_ARRAY(
   'Insurance is meant for protection, not for generating investment returns.',
   'Common types include life insurance, health insurance and vehicle insurance.',
   'Read policy documents carefully to understand what is and is not covered.',
   'Renewing your policy on time keeps your coverage active without interruption.'
 ), 13);
