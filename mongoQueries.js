1.users

{
    "_id": ObjectId,
    "name": "string",
    "email": "string",
    "codekata_score": "number",
    "attendance": [
      { "date": "YYYY-MM-DD", "status": "present/absent" }
    ],
    "tasks_submitted": [
      { "task_id": ObjectId, "submitted_date": "YYYY-MM-DD" }
    ],
    "mentor_id": ObjectId
  }
  
  
  2.codekata

  {
    "_id": ObjectId,
    "user_id": ObjectId,
    "problems_solved": "number"
  }

    
  3.attendance

  {
    "_id": ObjectId,
    "user_id": ObjectId,
    "date": "YYYY-MM-DD",
    "status": "present/absent"
  }

  
  4.topics

  {
    "_id": ObjectId,
    "name": "string",
    "date": "YYYY-MM-DD"
  }

  
  5.tasks

  {
    "_id": ObjectId,
    "name": "string",
    "topic_id": ObjectId,
    "date": "YYYY-MM-DD"
  }

  
  6.company_drives

  {
    "_id": ObjectId,
    "company_name": "string",
    "date": "YYYY-MM-DD",
    "appeared_users": [ObjectId]
  }

  
  7.mentors

  {
    "_id": ObjectId,
    "name": "string",
    "mentees": [ObjectId]
  }

  
  1.Find all the topics and tasks which are taught in October:

  db.topics.aggregate([
    { $match: { date: { $regex: "2024-10" } } },
    { $lookup: { from: "tasks", localField: "_id", foreignField: "topic_id", as: "tasks" } }
  ])

  
  2.Find all the company drives which appeared between 15-Oct-2020 and 31-Oct-2020:

  db.company_drives.find({
    date: { $gte: "2020-10-15", $lte: "2020-10-31" }
  })

  
  3.Find all the company drives and students who appeared for the placement:

  db.company_drives.aggregate([
    { $lookup: { from: "users", localField: "appeared_users", foreignField: "_id", as: "students" } }
  ])

  
  4.Find the number of problems solved by the user in codekata:

  db.users.aggregate([
    { $lookup: { from: "codekata", localField: "_id", foreignField: "user_id", as: "codekata" } },
    { $project: { name: 1, total_problems: { $sum: "$codekata.problems_solved" } } }
  ])

  
  5.Find all the mentors with mentees count more than 15:

  db.mentors.find({
    $expr: { $gt: [{ $size: "$mentees" }, 15] }
  })

  
  6.db.users.aggregate([
    {
      $lookup: { from: "attendance", localField: "_id", foreignField: "user_id", as: "attendance" }
    },
    { $lookup: { from: "tasks", localField: "_id", foreignField: "tasks_submitted.user_id", as: "submitted_tasks" } },
    { $match: {
        $and: [
          { "attendance.date": { $gte: "2020-10-15", $lte: "2020-10-31" } },
          { "attendance.status": "absent" },
          { "submitted_tasks.submitted_date": { $exists: false } }
        ]
      }
    },
    { $count: "users_absent_and_no_tasks" }
  ])
  

