import IeltsFullMocktest from "../models/IeltsFullMocktestModels";

const submitSection = async (req, res, next) => {
    try {
        const user_id  = req.user.uid;
        const section = req.params.section;
        const response = req.body;
    
        let ieltsTest = await IeltsFullMocktest.findOne({ user_id });
    
        if (!ieltsTest) {
            ieltsTest = new IeltsFullMocktest({ user_id });
        }    
        ieltsTest[section] = response;
        await ieltsTest.save();
        res.status(200).json(ieltsTest);
    } catch (error) {
        next(error);
    }
}

const submitTest = async (req, res, next) => {
    try{
        const user_id = req.user.uid;

        const ieltsTest = await IeltsFullMocktest.findOne({ user_id });

        if (!ieltsTest) {
          return res.status(404).json({ error: 'Test not found' });
        }
    
        const overallResult = 10;
    
        ieltsTest.overallResult = overallResult;
        ieltsTest.isTestCompleted = true;
    
        await ieltsTest.save();
    
        res.status(200).json(ieltsTest);
    } catch (err) {
        next(err);
    }
}

const checkPendingTest = async (req, res, next) => {
    try{
        const user_id = req.user.uid;
        const prevTest = await IeltsFullMocktest.findOne({user_id, isTestCompleted: false});

        if(!prevTest){
            return res.status(404).json({"message": "no previous test found"});
        }
        return res.json(prevTest);

    } catch (err) {
        next(err);
    }
}


const exitTest = async (req, res, next) => {
    try{
        const data = req.body;
        const deletedTest = await IeltsFullMocktest.findByIdAndRemove(data.id);

        if (!deletedTest) {
          return res.status(404).json({ error: 'Test not found' });
        }
        res.status(204).json({ message: 'Test deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export {submitSection, submitTest, checkPendingTest, exitTest};