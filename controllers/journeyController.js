// controllers/journeyController.js
import asyncHandler from "express-async-handler";
import Journey from "../models/JourneyModel.js";  // Note the capital J and M


const updateJourney = asyncHandler(async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const { basicInfo, progress } = req.body;

    // Find existing journey or create new one
    let journey = await Journey.findOne({ user_id: uid });

    if (!journey) {
      journey = new Journey({
        user_id: uid,
        basicInfo,
        progress
      });
    } else {
      // Update existing journey
      journey.basicInfo = basicInfo;
      journey.progress = progress;
      journey.lastUpdated = Date.now();
    }

    await journey.save();

    // Calculate overall progress
    const totalTasks = Object.values(journey.progress).reduce(
      (acc, section) => acc + Object.keys(section).length,
      0
    );
    
    const completedTasks = Object.values(journey.progress).reduce(
      (acc, section) => acc + Object.values(section).filter(Boolean).length,
      0
    );

    const overallProgress = Math.round((completedTasks / totalTasks) * 100);

    res.json({
      message: "Journey updated successfully",
      journey,
      overallProgress
    });

  } catch (err) {
    console.error('Error in updateJourney:', err);
    next(err);
  }
});

const getJourney = asyncHandler(async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const journey = await Journey.findOne({ user_id: uid });

    if (!journey) {
      return res.json({
        basicInfo: {},
        progress: {},
        overallProgress: 0
      });
    }

    // Calculate overall progress
    const totalTasks = Object.values(journey.progress).reduce(
      (acc, section) => acc + Object.keys(section).length,
      0
    );
    
    const completedTasks = Object.values(journey.progress).reduce(
      (acc, section) => acc + Object.values(section).filter(Boolean).length,
      0
    );

    const overallProgress = Math.round((completedTasks / totalTasks) * 100);

    res.json({
      basicInfo: journey.basicInfo,
      progress: journey.progress,
      overallProgress,
      lastUpdated: journey.lastUpdated
    });

  } catch (err) {
    console.error('Error in getJourney:', err);
    next(err);
  }
});

export { updateJourney, getJourney };