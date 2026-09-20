import unittest
import re
from pathlib import Path

class TestPortfolioWebsite(unittest.TestCase):
    def setUp(self):
        self.root = Path(__file__).resolve().parent.parent
        self.html_file = self.root / "index.html"
        self.css_file = self.root / "styles.css"
        self.js_file = self.root / "app.js"

    def test_files_exist(self):
        self.assertTrue(self.html_file.exists(), "index.html does not exist")
        self.assertTrue(self.css_file.exists(), "styles.css does not exist")
        self.assertTrue(self.js_file.exists(), "app.js does not exist")

    def test_html_semantics_and_metadata(self):
        content = self.html_file.read_text(encoding="utf-8")
        
        # Meta and headers
        self.assertIn("<!DOCTYPE html>", content)
        self.assertIn('<meta name="viewport"', content)
        self.assertIn('<meta name="description"', content)
        self.assertIn("Emmanuel Twumasi", content)
        
        # Semantic landmarks
        self.assertIn("<header", content)
        self.assertIn("<nav", content)
        self.assertIn("<main>", content)
        self.assertIn("<footer", content)
        
        # Required sections
        required_sections = ["hero", "about", "skills", "projects", "experience", "contact"]
        for sec in required_sections:
            self.assertRegex(content, rf'<section[^>]+id="{sec}"', f"Missing section #{sec}")

    def test_interactive_elements_present(self):
        content = self.html_file.read_text(encoding="utf-8")
        
        # Theme toggle
        self.assertIn('id="themeToggle"', content)
        
        # Form and inputs
        self.assertIn('id="contactForm"', content)
        self.assertIn('id="contactName"', content)
        self.assertIn('id="contactEmail"', content)
        self.assertIn('id="contactMessage"', content)
        self.assertIn('id="toastContainer"', content)
        
        # Project filter controls
        self.assertIn('data-filter="all"', content)
        self.assertIn('data-filter="fullstack"', content)
        self.assertIn('data-filter="ai-systems"', content)

    def test_accessibility_compliance(self):
        content = self.html_file.read_text(encoding="utf-8")
        
        # Check that form inputs have associated labels
        inputs = ["contactName", "contactEmail", "contactSubject", "contactMessage"]
        for inp in inputs:
            self.assertIn(f'for="{inp}"', content, f"Missing <label for='{inp}'>")
            
        # Theme toggle has accessible label
        self.assertIn('aria-label="Toggle dark and light theme"', content)

    def test_css_design_system_and_themes(self):
        content = self.css_file.read_text(encoding="utf-8")
        
        # Theme blocks
        self.assertIn(":root", content)
        self.assertIn('[data-theme="light"]', content)
        
        # Essential tokens in both themes
        essential_vars = ["--bg-primary", "--text-primary", "--accent", "--card-bg"]
        for var in essential_vars:
            self.assertIn(var, content, f"Missing CSS variable {var}")
            
        # Responsive breakpoints
        self.assertIn("@media (max-width: 768px)", content)
        self.assertIn("@media (max-width: 1024px)", content)

    def test_js_interactivity_components(self):
        content = self.js_file.read_text(encoding="utf-8")
        
        # Theme logic
        self.assertIn("localStorage.setItem('demon_theme'", content)
        self.assertIn("prefers-color-scheme", content)
        
        # Filter logic
        self.assertIn("data-filter", content)
        
        # Form validation
        self.assertIn("validateEmail", content)
        self.assertIn("showToast", content)

if __name__ == "__main__":
    unittest.main()
