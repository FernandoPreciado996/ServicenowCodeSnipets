var timesheet = {}
timesheet.monday = [
    {
        '4thsource':[
            {
                descrption:'Jose meeting',
                time:.5,
                realtime:.5
            },
            {
                descrption:'OPP sprint',
                time:.5,
                realtime:.5
            },
            {
                descrption:'infor Admin story 28',
                time:.5,
                realtime:.5
            },
            {
                descrption:'story to story developmnet, duplicate numbers in both instances',
                time:2.5,
                realtime:1
            },
            {
                descrption:'Diplomat INC0464383',
                time:1,
                realtime:1.5
            },
            {
                descrption:'Admin',
                time:1,
                realtime:1
            },
            {
                descrption:'Jose Next steps',
                time:3,
                realtime:2
            },
            {
                descrption:'English',
                time:1,
                realtime:0
            },
        ],
            
        'Handcloud':[
            {
                descrption:'Admin,Read emails small fixes in cemex,developer meeting',
                time:2,
                realtime:2
            },
            {
                descrption:'SAT',
                time:2,
                realtime:2
            },
                   
        ]

    }
]
  
timesheet.tuesday =[
    {
        '4thsource':[
            {
                descrption:'Meetings-Scrum,portal,resource',
                time:1.5,
                realtime:1.5
            },
            {
                descrption:'Infor Backup',
                time:1,
                realtime:.5
            },
            {
                descrption:'Admin',
                time:1,
                realtime:1
            },
            {
                descrption:'Opportunities grooming',
                time:.5,
                realtime:.5
            },
            {
                descrption:'STRY0011928',
                time:2,
                realtime:.5
            },
            {
                descrption:'Internal Service portal stories update',
                time:1.5,
                realtime:1.5
            },
            {
                descrption:'Story to Story, refact code,implement the developmet in diplomat,Create system property ui page, start the manual',
                time:1.5,
                realtime:1.5

            },
           
        ],
        'Handcloud':[
            {
                descrption:'Scrum',
                time:.5,
                realtime:.5
            },
            {
                descrption:'Meetings Admin',
                time:.5,
                realtime:.5
            },
        ]

    }
]

timesheet.wenesday =[
    {
        '4thsource':[
            {
                descrption:'Meetings-Scrum,GRooming,Doug',
                time:2,
                realtime:2
            },
            {
                descrption:'Infor Saas STRY0025452- Israel Testing steps',
                time:1,
                realtime:.5
            },
            {
                descrption:'Inbfor saas/cloud STRY0024228 Admin/rework',
                time:2,
                realtime:1
            },
            {
                descrption:'Admin',
                time:1,
                realtime:1
            },
            {
                descrption:'Story to Story',
                time:1.5,
                realtime:2
            },
            {
                descrption:'4thsource Internal',
                time:1,
                realtime:1
            },
            
           
           
        ],
        'Handcloud':[
            {
                descrption:'Scrum',
                time:.5,
                realtime:.5
            },
            
        ]

    }
]






































// backup infor saas
// 
//console.log(getRealTimeByDay('monday','realtime'))
console.log(getRealTimeByDay('monday','time'))
function getRealTimeByDay(day,type){
    let total =0;
    for (var i in timesheet[day]){
        for (var o in timesheet[day][i]){
            for (var u in timesheet[day][i][o]){
                total += timesheet[day][i][o][u][type];
                console.log(timesheet[day][i][o][u].descrption + ' ' + timesheet[day][i][o][u][type])
            } 
        } 
    }
    return total;
}
