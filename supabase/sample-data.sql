-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
-- Optional: Run this to populate your database with test data

-- Insert sample courses
INSERT INTO courses (name, description, price, duration) VALUES
  ('Full Stack Web Development', 'Learn to build modern web applications with React, Node.js, and databases', 150000.00, '3 months'),
  ('Mobile App Development', 'Master iOS and Android app development with React Native', 180000.00, '4 months'),
  ('Data Science & Analytics', 'Learn Python, data analysis, machine learning, and visualization', 200000.00, '5 months'),
  ('UI/UX Design', 'Master user interface and user experience design principles', 120000.00, '2 months'),
  ('Digital Marketing', 'Learn SEO, social media marketing, and content strategy', 100000.00, '6 weeks');

-- Note: Students and admins will be created through the authentication flow
-- But you can manually create test admins after they sign up

-- Example: After creating a user via Supabase Auth, you can make them an admin:
-- INSERT INTO admins (user_id, name, email, role) VALUES
--   ('user-uuid-from-auth-users-table', 'Admin Name', 'admin@example.com', 'super_admin');
