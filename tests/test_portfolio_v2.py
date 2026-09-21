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

    def test_availability_badge_removed(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        self.assertNotIn("Available for engineering roles", html_content)

    def test_command_palette_feature(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="cmdPalette"', html_content)
        self.assertIn('id="cmdPaletteBtn"', html_content)
        self.assertIn('id="cmdPaletteInput"', html_content)
        self.assertIn('id="cmdPaletteResults"', html_content)
        self.assertIn(".cmd-palette-backdrop", css_content)
        self.assertIn("commandItems", js_content)
        self.assertIn("openCmdPalette", js_content)
        self.assertIn("closeCmdPalette", js_content)

    def test_scroll_progress_bar(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="scrollProgressBar"', html_content)
        self.assertIn(".scroll-progress-bar", css_content)
        self.assertIn("scrollProgressBar", js_content)

    def test_architecture_diagrams_and_filter_counts(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="modalDiagram"', html_content)
        self.assertIn(".architecture-diagram-svg", css_content)
        self.assertIn("architecture-diagram-svg", js_content)
        self.assertIn("filter-count", html_content)
        self.assertIn(".filter-count", css_content)

    def test_deployment_workflow(self):
        self.assertTrue(self.workflow_file.exists(), "deploy.yml workflow file missing")
        workflow_content = self.workflow_file.read_text(encoding="utf-8")
        self.assertIn("actions/deploy-pages", workflow_content)
        self.assertIn("actions/upload-pages-artifact", workflow_content)

    def test_shwn_design_labs_section_and_widgets(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        # Labs section exists
        self.assertIn('id="labs"', html_content)
        self.assertIn(".labs-section", css_content)
        self.assertIn(".labs-grid", css_content)

        # 4 Interactive Prototypes
        self.assertIn('id="labTokenBucket"', html_content)
        self.assertIn('id="labFsm"', html_content)
        self.assertIn('id="labLedger"', html_content)
        self.assertIn('id="labLruCache"', html_content)

        # Interactive controls
        self.assertIn('id="btnConsumeToken"', html_content)
        self.assertIn('id="btnFsmStep"', html_content)
        self.assertIn('id="btnBalanceLedger"', html_content)
        self.assertIn('id="btnLruPut"', html_content)

        # JS controllers
        self.assertIn("initEngineeringLabs", js_content)
        self.assertIn("tokenCapacity", js_content)
        self.assertIn("fsmStates", js_content)
        self.assertIn("auditLedger", js_content)
        self.assertIn("accessKey", js_content)

    def test_floating_nav_pill_and_sound_engine(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="soundToggle"', html_content)
        self.assertIn('data-sound="muted"', html_content)
        self.assertIn("sound-on-icon", html_content)
        self.assertIn("sound-off-icon", html_content)
        self.assertIn("#soundToggle[data-sound=", css_content)
        self.assertIn("SoundEngine", js_content)
        self.assertIn("AudioContext", js_content)
        self.assertIn("demon_sound", js_content)

    def test_hero_interactive_living_keywords(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('class="interactive-kw"', html_content)
        self.assertIn('data-kw="backends"', html_content)
        self.assertIn('data-kw="state"', html_content)
        self.assertIn('data-kw="agents"', html_content)
        self.assertIn(".kw-popover", css_content)
        self.assertIn("initHeroKeywords", js_content)

    def test_zero_emojis_in_html(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        # Ensure no typical emoji ranges in index.html (Pro Vector SVGs only)
        emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)
        matches = emoji_pattern.findall(html_content)
        self.assertEqual(matches, [], f"Found disallowed emojis in HTML: {matches}")

    def test_cmd_palette_aria_accessibility(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        self.assertIn('aria-labelledby="cmdPaletteTitle"', html_content)
        self.assertIn('id="cmdPaletteTitle"', html_content)
        self.assertIn('aria-live="polite"', html_content)

    def test_touch_target_bounds(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        # Ensure icon-btn and hamburger-btn are at least 44px
        self.assertIn("min-width: 44px;", css_content)
        self.assertIn("min-height: 44px;", css_content)

    def test_nav_pill_sliding_indicator(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        self.assertIn('id="navPillIndicator"', html_content)
        self.assertIn(".nav-pill-indicator", css_content)
        self.assertIn("initNavPillIndicator", js_content)

    def test_tactile_audio_synthesizer_architecture(self):
        js_content = self.js_file.read_text(encoding="utf-8")
        self.assertIn("createDynamicsCompressor", js_content)
        self.assertIn("playNoiseImpulse", js_content)
        self.assertIn("TactileSoundEngine", js_content)
        for preset in ["click", "pop", "thud", "tick", "latch", "success", "denied"]:
            self.assertIn(f"{preset}:", js_content)

    def test_four_physical_instruments_components(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        js_content = self.js_file.read_text(encoding="utf-8")

        # Instrument 1: Token Dispenser M-10
        self.assertIn("token-dispenser-housing", html_content)
        self.assertIn("token-chute-col", html_content)
        self.assertIn(".token-dispenser-housing", css_content)
        self.assertIn(".token-pellet", css_content)

        # Instrument 2: Avionics Sequencer
        self.assertIn("fsm-hardware-controls", html_content)
        self.assertIn('id="fsmRotaryDial"', html_content)
        self.assertIn(".rotary-dial", css_content)
        self.assertIn("faultAbortController", js_content)

        # Instrument 3: Double-Entry Torsion Balance
        self.assertIn("torsion-balance-stage", html_content)
        self.assertIn('id="balanceBeam"', html_content)
        self.assertIn('id="wheelDebit"', html_content)
        self.assertIn('id="wheelCredit"', html_content)
        self.assertIn(".balance-scale-svg", css_content)
        self.assertIn(".thumbwheel-roller-track", css_content)

        # Instrument 4: 1U Hot-Swap Memory Rack
        self.assertIn("caddy-rack", html_content)
        self.assertIn(".caddy-rack", css_content)
        self.assertIn(".caddy-lcd", css_content)
        self.assertIn(".caddy-led", css_content)

    def test_modal_focus_trap_and_restoration(self):
        js_content = self.js_file.read_text(encoding="utf-8")
        self.assertIn("lastFocusedModalTrigger", js_content)
        self.assertIn("lastFocusedCmdTrigger", js_content)
        self.assertIn("focusables", js_content)
        self.assertIn("e.shiftKey", js_content)

    def test_wcag_contrast_calibration(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        # Verify light mode calibrated contrast variables
        self.assertIn("--badge-success-text:", css_content)
        self.assertIn("--badge-danger-text:", css_content)
        self.assertIn("#047857", css_content)
        self.assertIn("#b91c1c", css_content)

    def test_nav_button_containment(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        # Ensure navbar padding leaves clearance and prevents protrusion
        self.assertIn("padding: 0 8px 0 16px;", css_content)
        # Ensure nav-actions buttons use full concentric pill radius and locked 34px height
        self.assertIn(".nav-actions .btn {", css_content)
        self.assertIn(".nav-actions .btn-primary {", css_content)
        self.assertIn("border-radius: var(--radius-full);", css_content)
        self.assertIn("height: 34px;", css_content)

    def test_mobile_breakpoint_covers_tablet_range(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        match = re.search(r'@media\s*\(\s*max-width:\s*(\d+)px\s*\)\s*\{[^}]*\.hamburger-btn\s*\{[^}]*display:\s*flex', css_content)
        self.assertIsNotNone(match, "Could not find mobile navigation media query for .hamburger-btn")
        breakpoint = int(match.group(1))
        self.assertGreaterEqual(
            breakpoint, 1024,
            f"Regression Defect: Mobile breakpoint is {breakpoint}px. Must be >= 1024px to prevent tablet overflow."
        )

    def test_mobile_drawer_contains_cv_and_contact_actions(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        drawer_match = re.search(r'id=["\']mobileDrawer["\'](.*?)</div>\s*</div>\s*</div>', html_content, re.DOTALL)
        self.assertIsNotNone(drawer_match, "mobileDrawer element missing in index.html")
        drawer_content = drawer_match.group(1)
        self.assertIn("Let's Talk", drawer_content)
        self.assertIn("CV / Resume", drawer_content)
        self.assertIn('href="#contact"', drawer_content)

    def test_mobile_backdrop_overlay_present(self):
        html_content = self.html_file.read_text(encoding="utf-8")
        css_content = self.css_file.read_text(encoding="utf-8")
        self.assertIn('id="mobileDrawerOverlay"', html_content)
        self.assertIn(".mobile-drawer-overlay", css_content)
        self.assertIn(".mobile-drawer-backdrop", css_content)

    def test_mobile_drawer_touch_targets(self):
        css_content = self.css_file.read_text(encoding="utf-8")
        self.assertIn("min-height: 48px;", css_content)
        self.assertIn(".btn-drawer-cta", css_content)

    def test_keyboard_accessibility_and_escape_dismissal(self):
        js_content = self.js_file.read_text(encoding="utf-8")
        self.assertIn("Close navigation menu", js_content)
        self.assertIn("Open navigation menu", js_content)
        self.assertIn("Escape", js_content)
        self.assertIn("mobileMenuBtn.focus()", js_content)

if __name__ == "__main__":
    unittest.main()
