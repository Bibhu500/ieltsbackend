//ReadingModel.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: [String], required: true }
});

const QuestionSetSchema = new mongoose.Schema({
    questionSetNumber: { type: String, required: true },
    questionRange: { type: String, required: true },
    questionSetInstruction: { type: String, required: true },
    questionType: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true }
});

const PassageSchema = new mongoose.Schema({
    passageNo: { type: String, required: true },
    passageInstructions: { type: String, required: true },
    passageTitle: { type: String, required: true },
    paragraphs: { type: [String], required: true },
    questionSets: { type: [QuestionSetSchema], required: true }
});

const SectionSchema = new mongoose.Schema({
    sectionNumber: { type: String, required: true },
    sectionInstructions: { type: String, required: true },
    passages: { type: [PassageSchema], required: true }
});

const ReadingSchema = new mongoose.Schema(
    {
        setId: { type: String, required: true },
        setType: { type: String, enum: ['general', 'academic'], required: true},
        sections: { type: [SectionSchema], required: true }
    },
    {
        timestamps: true,
    }
);

const Reading = mongoose.model("Reading", ReadingSchema);
export default Reading;
