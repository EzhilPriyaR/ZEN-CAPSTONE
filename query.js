module.exports = {

genderCount : [
  {
    '$group': {
      '_id': '$gender', 
      'count': {
        '$sum': 1
      }
    }
  }
],

languageCount : [
  {
    '$group': {
      '_id': '$language', 
      'count': {
        '$sum': 1
      }
    }
  }
],

majorCount : [
  {
    '$group': {
      '_id': '$major', 
      'count': {
        '$sum': 1
      }
    }
  }
],

topSvnOvr : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          '$scores.testTotal', 1
        ]
      }
    }
  }, {
    '$sort': {
      'singleTestScore': -1
    }
  }, {
    '$limit': 7
  }
],

topSvnSub : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          {
            '$arrayElemAt': [
              '$scores.testMarks', 0
            ]
          }, 0
        ]
      }
    }
  }, {
    '$sort': {
      'singleTestScore': -1
    }
  }, {
    '$limit': 7
  }
],

perfSegOvr : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          '$scores.testTotal', 0
        ]
      }
    }
  }, {
    '$sort': {
      'singleTestScore': -1
    }
  }, {
    '$bucket': {
      'groupBy': '$singleTestScore', 
      'boundaries': [0, 900, 1020, 1200],
      'default': 1200,
      'output': {
        'count': {
          '$sum': 1
        }
      }
    }
  }
],

perfSegSub : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          {
            '$arrayElemAt': [
              '$scores.testMarks', 0
            ]
          }, 0
        ]
      }
    }
  }, {
    '$sort': {
      'singleTestScore': -1
    }
  }, {
    '$bucket': {
      'groupBy': '$singleTestScore', 
      'boundaries': [
        0, 150, 170, 200
      ], 
      'default': 200, 
      'output': {
        'count': {
          '$sum': 1
        }
      }
    }
  }
],

allStuScoresOvr : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          '$scores.testTotal', 0
        ]
      }
    }
  }
],

allStuScoresSub : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'id': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'singleTestScore': {
        '$arrayElemAt': [
          {
            '$arrayElemAt': [
              '$scores.testMarks', 0
            ]
          }, 0
        ]
      }
    }
  }
],

allTimeOvr : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'sno': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'allTimeLow': {
        '$min': '$scores.testTotal'
      }, 
      'allTimeHigh': {
        '$max': '$scores.testTotal'
      }, 
      'allTimeAvg': {
        '$avg': '$scores.testTotal'
      }
    }
  }
],

allTimeSub : [
  {
    '$match': {
      'gender': 'Female', 
      'language': 'Tamil', 
      'major': 'Commerce'
    }
  }, {
    '$project': {
      'sno': '$id', 
      'name': '$name', 
      'gender': '$gender', 
      'language': '$language', 
      'major': '$major', 
      'allTimeLow': {
        '$min': {
          '$map': {
            'input': '$scores.testMarks', 
            'as': 'targetValue', 
            'in': {
              '$arrayElemAt': [
                '$$targetValue', 0
              ]
            }
          }
        }
      }, 
      'allTimeHigh': {
        '$max': {
          '$map': {
            'input': '$scores.testMarks', 
            'as': 'targetValue', 
            'in': {
              '$arrayElemAt': [
                '$$targetValue', 0
              ]
            }
          }
        }
      }, 
      'allTimeAvg': {
        '$trunc': [
          {
            '$avg': {
              '$map': {
                'input': '$scores.testMarks', 
                'as': 'targetValue', 
                'in': {
                  '$arrayElemAt': [
                    '$$targetValue', 0
                  ]
                }
              }
            }
          }, 2
        ]
      }
    }
  }
]

};