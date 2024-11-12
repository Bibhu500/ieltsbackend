// models/journeyModel.js
import mongoose from "mongoose";

const journeySchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  basicInfo: {
    name: String,
    targetCountry: String,
    targetUniversity: String,
    intendedMajor: String,
    targetTerm: String
  },
  progress: {
    step1_PrePlanning: {
      academicGoals: Boolean,
      careerGoals: Boolean,
      countryResearch: Boolean,
      initialBudgetEstimate: Boolean
    },
    step2_CourseSelection: {
      courseResearch: Boolean,
      universityShortlist: Boolean,
      programRequirements: Boolean,
      admissionDeadlines: Boolean
    },
    step3_ExamPrep: {
      standardizedTests: Boolean,
      languageTests: Boolean,
      mockInterviews: Boolean
    },
    step4_Documentation: {
      transcripts: Boolean,
      passport: Boolean,
      recommendationLetters: Boolean,
      statementOfPurpose: Boolean,
      resumeCV: Boolean
    },
    step5_Financials: {
      tuitionFees: Boolean,
      loanResearch: Boolean,
      loanApplication: Boolean,
      scholarshipApplications: Boolean,
      bankStatements: Boolean,
      proofOfFunds: Boolean
    },
    step6_Applications: {
      universityApplications: Boolean,
      applicationFees: Boolean,
      acceptanceLetters: Boolean
    },
    step7_VisaPrep: {
      visaRequirements: Boolean,
      visaApplication: Boolean,
      visaInterview: Boolean,
      medicalCheckup: Boolean
    },
    step8_Accommodation: {
      accommodationResearch: Boolean,
      housingApplication: Boolean,
      housingDeposit: Boolean,
      temporaryStay: Boolean
    },
    step9_Travel: {
      flightResearch: Boolean,
      flightBooking: Boolean,
      travelInsurance: Boolean,
      airportPickup: Boolean
    },
    step10_Packing: {
      essentialDocuments: Boolean,
      clothes: Boolean,
      electronics: Boolean,
      medicines: Boolean,
      localCurrency: Boolean
    },
    step11_PreDeparture: {
      mobileConnection: Boolean,
      bankAccounts: Boolean,
      localTransport: Boolean,
      emergencyContacts: Boolean,
      studentOrientation: Boolean
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Journey = mongoose.model("Journey", journeySchema);
export default Journey;