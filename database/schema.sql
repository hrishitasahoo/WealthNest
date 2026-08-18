CREATE DATABASE IF NOT EXISTS wealthnest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE wealthnest;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(50) NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  preferred_language ENUM('en', 'hi', 'hinglish', 'bn', 'ta', 'mr') NOT NULL DEFAULT 'en',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS financial_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  age INT NULL,
  monthly_income DECIMAL(12,2) NULL DEFAULT 0,
  monthly_expenses DECIMAL(12,2) NULL DEFAULT 0,
  current_savings DECIMAL(12,2) NULL DEFAULT 0,
  existing_investments DECIMAL(12,2) NULL DEFAULT 0,
  monthly_saving_capacity DECIMAL(12,2) NULL DEFAULT 0,
  main_financial_goal VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_profile_user (user_id),
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS financial_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  goal_name VARCHAR(150) NOT NULL,
  description VARCHAR(255) NULL,
  goal_type VARCHAR(50) NOT NULL DEFAULT 'Other',
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_date DATE NOT NULL,
  monthly_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,
  status ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_goal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_goal_target_positive CHECK (target_amount > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS budget_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category ENUM(
    'Food','Groceries','Rent','Utilities','Transport','Education','Healthcare',
    'Shopping','Entertainment','Bills','Family','Travel','Personal','Other'
  ) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method ENUM('Cash','UPI','Debit Card','Credit Card','Net Banking','Other') NULL,
  description VARCHAR(255) NULL,
  note VARCHAR(255) NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_budget_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_budget_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS budget_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  monthly_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  recurring_expenses DECIMAL(12,2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_budget_plan_user (user_id),
  CONSTRAINT fk_budget_plan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS savings_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  goal_id INT NULL,
  amount DECIMAL(12,2) NOT NULL,
  entry_date DATE NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_savings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_savings_goal FOREIGN KEY (goal_id) REFERENCES financial_goals(id) ON DELETE SET NULL,
  CONSTRAINT chk_savings_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS financial_schemes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scheme_name VARCHAR(200) NOT NULL,
  category ENUM('Savings','Pension','Education','Insurance','Students','Women','Farmers','Small Businesses') NOT NULL,
  purpose TEXT NOT NULL,
  intended_for TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  key_benefits TEXT NOT NULL,
  limitations TEXT NOT NULL,
  official_source VARCHAR(255) NOT NULL,
  official_url VARCHAR(500) NULL,
  last_verified_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS learning_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Basics',
  simple_explanation TEXT NOT NULL,
  example_text TEXT NOT NULL,
  key_points JSON NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_learning_slug (slug)
) ENGINE=InnoDB;

CREATE INDEX idx_goals_user ON financial_goals(user_id);
CREATE INDEX idx_budget_user_date ON budget_entries(user_id, entry_date);
CREATE INDEX idx_savings_user_date ON savings_entries(user_id, entry_date);
CREATE INDEX idx_schemes_category ON financial_schemes(category);
