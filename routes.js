const express = require('express');
const router = express.Router();

const { genderCount, languageCount, majorCount, topSvnOvr, topSvnSub, perfSegOvr, perfSegSub, allStuScoresOvr, allStuScoresSub, allTimeOvr, allTimeSub } = require('./query.js');
const { executeQuery } = require('./queryExecutor.js');

// Get count {gender, language, major}
router.get('/count/:criteria', (req, res) => {

    if (req.params.criteria == 'gender') {
        executeQuery(genderCount, (resJsn) => {
            res.end(JSON.stringify(resJsn));
        });
    } else if (req.params.criteria == 'language') {
        executeQuery(languageCount, (resJsn) => {
            res.end(JSON.stringify(resJsn));
        });
    } else if (req.params.criteria == 'major') {
        executeQuery(majorCount, (resJsn) => {
            res.end(JSON.stringify(resJsn));
        });
    } else {
        res.send('Invalid criteria Requested!');
    }
})

// Get metric {topSeven, perfClass, allScores}
router.get('/metric/:metricName/:subject/:testId', (req, res) => {
    let matchStage = compileMatchStage(req.query.gender, req.query.language, req.query.major);
    if (req.params.metricName == 'topSeven') {
        if (req.params.subject == 'Overall') {
            topSvnOvr[0].$match = matchStage;
            topSvnOvr[1].$project.singleTestScore.$arrayElemAt[1] = parseInt(req.params.testId);
            executeQuery(topSvnOvr, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        } else {
            topSvnSub[0].$match = matchStage;
            topSvnSub[1].$project.singleTestScore.$arrayElemAt[0].$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
            executeQuery(topSvnSub, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        }

    } else if (req.params.metricName == 'performanceClass') {
        if (req.params.subject == 'Overall') {
            perfSegOvr[0].$match = matchStage;
            perfSegOvr[1].$project.singleTestScore.$arrayElemAt[1] = parseInt(req.params.testId);
            executeQuery(perfSegOvr, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        } else {
            perfSegSub[0].$match = matchStage;
            perfSegSub[1].$project.singleTestScore.$arrayElemAt[0].$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
            executeQuery(perfSegSub, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        }

    } else if (req.params.metricName == 'allStudentsScores') {
        if (req.params.subject == 'Overall') {
            allStuScoresOvr[0].$match = matchStage;
            allStuScoresOvr[1].$project.singleTestScore.$arrayElemAt[1] = parseInt(req.params.testId);
            executeQuery(allStuScoresOvr, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        } else {
            allStuScoresSub[0].$match = matchStage;
            allStuScoresSub[1].$project.singleTestScore.$arrayElemAt[0].$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
            executeQuery(allStuScoresSub, (resJsn) => {
                res.end(JSON.stringify(resJsn));
            });
        }

    } else {
        res.send('Invalid Metric Requested!');
    }
})

// Get grid Data
router.get('/gridData/:subject', (req, res) => {
    let matchStage = compileMatchStage(req.query.gender, req.query.language, req.query.major);
    if (req.params.subject == 'Overall') {
        allTimeOvr[0].$match = matchStage;
        executeQuery(allTimeOvr, (resJsn) => {
            res.end(JSON.stringify(resJsn));
        });
    } else {
        allTimeSub[0].$match = matchStage;
        allTimeSub[1].$project.allTimeLow.$min.$map.in.$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
        allTimeSub[1].$project.allTimeHigh.$max.$map.in.$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
        allTimeSub[1].$project.allTimeAvg.$trunc[0].$avg.$map.in.$arrayElemAt[1] = mapSubjectNameToIndex(req.params.subject);
        executeQuery(allTimeSub, (resJsn) => {
            res.end(JSON.stringify(resJsn));
        });
    }
})

function compileMatchStage(gen, lang, maj) {
    let tempObj = {};
    if (gen != 'All') {
        tempObj['gender'] = gen;
    }

    if (lang != 'All') {
        tempObj['language'] = lang;
    }

    if (maj != 'All') {
        tempObj['major'] = maj;
    }
    return tempObj;
}

function mapSubjectNameToIndex(sub) {
    switch (sub) {
        case 'Tamil':
        case 'French':
        case 'Hindi':
        case 'Sanskrit':
            return 0;
        case 'English':
            return 1;
        case 'Maths':
            return 2;
        case 'Physics':
        case 'Economics':
            return 3;
        case 'Chemistry':
        case 'Accountancy':
            return 4;
        case 'Biology':
        case 'Computer':
        case 'Commerce':
            return 5;
        default:
            return 0;
    }
}

module.exports = router;