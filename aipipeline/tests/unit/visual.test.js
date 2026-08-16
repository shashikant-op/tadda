"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VisualService_1 = require("../../src/visuals/VisualService");
describe('Visual / Image Prompt Generator (Step 06)', () => {
    it('should generate a valid visual prompt when required', () => {
        const service = new VisualService_1.VisualService();
        const visual = service.generateVisualPrompt('Phases of Compiler', 'Lexical analysis and syntax analysis pipeline.');
        expect(visual.required).toBe(true);
        expect(visual.type).toBe('flowchart');
        expect(visual.prompt).toBeDefined();
        expect(visual.prompt.length).toBeGreaterThan(10);
    });
    it('should indicate visual not required for generic text', () => {
        const service = new VisualService_1.VisualService();
        const visual = service.generateVisualPrompt('Random Introduction', 'Basic text without architectural flow.');
        expect(visual.required).toBe(false);
        expect(visual.type).toBe('none');
    });
});
