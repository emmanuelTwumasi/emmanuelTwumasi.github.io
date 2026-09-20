import unittest
import json
import re
import os
import xml.etree.ElementTree as ET
from pathlib import Path

class TestPortfolioV2Enhancements(unittest.TestCase):
    def setUp(self):
        self.root = Path(__file__).resolve().parent.parent
        self.html_file = self.root / "index.html"
        self.css_file = self.root / "styles.css"
        self.js_file = self.root / "app.js"
        self.robots_file = self.root / "robots.txt"
        self.sitemap_file = self.root / "sitemap.xml"
        self.workflow_file = self.root / ".github" / "workflows" / "deploy.yml"

    def test_seo_files_exist_and_valid(self):
        self.assertTrue(self.robots_file.exists(), "robots.txt missing")
        self.assertTrue(self.sitemap_file.exists(), "sitemap.xml missing")

        # robots.txt validation
        robots_content = self.robots_file.read_text(encoding="utf-8")
        self.assertIn("User-agent: *", robots_content)
        self.assertIn("Sitemap: https://emmanuelTwumasi.github.io/sitemap.xml", robots_content)

        # sitemap.xml validation
        sitemap_content = self.sitemap_file.read_text(encoding="utf-8")
        root = ET.fromstring(sitemap_content)
        self.assertTrue(len(root) > 0, "Sitemap urlset should not be empty")
        self.assertIn("https://emmanuelTwumasi.github.io/", sitemap_content)

    def test_jsonld_structured_data(self):
        content = self.html_file.read_text(encoding="utf-8")
        match = re.search(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
        self.assertIsNotNone(match, "JSON-LD script tag not found in index.html")
        data = json.loads(match.group(1))
        self.assertEqual(data.get("@type"), "Person")
        self.assertEqual(data.get("name"), "Emmanuel Twumasi")
        self.assertEqual(data.get("url"), "https://emmanuelTwumasi.github.io")
        self.assertIn("https://github.com/emmanuelTwumasi", data.get("sameAs", []))

    def test_real_github_repositories_present(self):
        content = self.html_file.read_text(encoding="utf-8")
        expected_repos = [
            "https://github.com/emmanuelTwumasi/demonOS",
            "https://github.com/emmanuelTwumasi/banking_application",
            "https://github.com/emmanuelTwumasi/protwum",
            "https://github.com/emmanuelTwumasi/Android1",
        ]
        for repo in expected_repos:
            self.assertIn(repo, content, f"Expected repository {repo} not linked in index.html")

    def test_architecture_modal_markup_and_script(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        # HTML elements
        self.assertIn('id="projectModal"', html_content)
        self.assertIn('id="closeModalBtn"', html_content)
        self.assertIn('id="modalTitle"', html_content)
        self.assertIn('id="modalHighlights"', html_content)
        self.assertIn('id="modalTags"', html_content)
        self.assertIn('id="modalGithubLink"', html_content)

        # JS triggers and objects
        self.assertIn("projectDetails", js_content)
        self.assertIn("openProjectModal", js_content)
        self.assertIn("closeProjectModal", js_content)
        self.assertIn("demonos", js_content)
        self.assertIn("banking", js_content)
        self.assertIn("protwum", js_content)
        self.assertIn("android1", js_content)

    def test_print_cv_feature(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="printCvBtn"', html_content)
        self.assertIn("window.print()", js_content)
        self.assertIn("@media print", css_content)
        self.assertIn("#navbar", css_content)

    def test_zero_gradients_and_pro_vectors(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        html_content = self.html_file.read_text(encoding="utf-8")

        # Zero gradients rule
        self.assertNotIn("linear-gradient", css_content)
        self.assertNotIn("radial-gradient", css_content)
        self.assertNotIn("conic-gradient", css_content)

        # Avatar present
        self.assertIn("https://avatars.githubusercontent.com/u/58420781?v=4", html_content)

    def test_deployment_workflow(self):
        self.assertTrue(self.workflow_file.exists(), "deploy.yml workflow file missing")
        workflow_content = self.workflow_file.read_text(encoding="utf-8")
        self.assertIn("actions/deploy-pages", workflow_content)
        self.assertIn("actions/upload-pages-artifact", workflow_content)

if __name__ == "__main__":
    unittest.main()
