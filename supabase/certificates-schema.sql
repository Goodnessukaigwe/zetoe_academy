-- ============================================
-- CERTIFICATES TABLE FOR VERIFICATION SYSTEM
-- ============================================
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Certificate identification
  certificate_code TEXT UNIQUE NOT NULL, -- e.g., "CERT-2025-001"
  certificate_number TEXT, -- Display number (e.g., "ZA/HTML/2025/001")
  
  -- Student information
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  
  -- Course information
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  course_name TEXT NOT NULL,
  exam_id UUID REFERENCES exams(id) ON DELETE SET NULL,
  exam_title TEXT,
  
  -- Score/Achievement
  score_id UUID REFERENCES scores(id) ON DELETE SET NULL,
  final_score DECIMAL(5, 2),
  grade TEXT, -- "Distinction", "Pass", "Merit"
  
  -- Certificate file
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  
  -- Issue details
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  
  -- Metadata
  issued_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  notes TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_is_active ON certificates(is_active);

-- Trigger
CREATE TRIGGER update_certificates_updated_at 
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public can verify certificates
CREATE POLICY "Anyone can view active certificates"
  ON certificates FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage certificates
CREATE POLICY "Admins can insert certificates"
  ON certificates FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update certificates"
  ON certificates FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- Code generator function
CREATE OR REPLACE FUNCTION generate_certificate_code()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_number TEXT;
  new_code TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  
  SELECT LPAD((COUNT(*) + 1)::TEXT, 3, '0')
  INTO next_number
  FROM certificates
  WHERE certificate_code LIKE 'CERT-' || current_year || '-%';
  
  new_code := 'CERT-' || current_year || '-' || next_number;
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Certificate verification system setup complete!';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '1. Create storage bucket "certificates" in Supabase Dashboard';
  RAISE NOTICE '2. Test: SELECT generate_certificate_code();';
END $$;
