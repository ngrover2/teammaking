
# A React application that helps asses compatibility for potential team members.

![Teammaking - member compatibility scores image](assets/TeammakingIndividualScores.png)

A good team can not be just put together by assigning people randomly to a group. Compatibility amongst the members is very important for the team as a whole to deliver the best performance. Therefore, any effort made towards asessing the compatibility between potential members can only help.

For a course project, we created a team making app that allows a professor to create a survey that can be filled by students for the purpose of creating project teams. Each student's answers can be compared to that of the other students. Compatibility scores for each student against all other students can then be deduced which can help match compatible candidates. 

### Create Courses

The professor can create cards for all the courses that he/she teaches.

A csv formatted roster containing students' details can be uploaded for each course. 

![Teammaking - upload csv roster image](assets/TeammakingUploadRoster.png)

The roster can be edited before uploading to the back-end.

### Survey Design

The app provides a dynamic survey creation feature where the professor can create many different types of questions. A weight value can also be attached to each question signifying its important in the final score calculation while evaluating compatibility. The main types of questions are: 

* Free form text answer type

![Teammaking - Add free-form question image](assets/TeammakingTextQuestion.png)

* Single answer type

The professor can create any number of choices and see a preview of how it looks. After creating the question, the professor can still edit it from the preview section so that redundant work does not have to be repeated. Also, a default choice can be added from among the added choices. 

![Teammaking - Add single choice question image](assets/TeammakingSingleChoiceQuestion.png)

* Multiple choice answer type
  
Any number of choices can be created for the question. Choices can be added or removed at any time before submitting the survey to the back-end.

![Teammaking - Add multiple choice question image](assets/TeammakingMultipleChoiceQuestion.png)

* Multiple values answer type 

With this question type, the professor can choose to limit how many answers a student can provide for the question. This question is helpful when a student may have multiple answers which can not be pre-determined. For example a question like “What tools/frameworks are you most familiar with” could have many different answers.

![Teammaking - Add multiple values question image](assets/TeammakingMultipleValuesQuestion.png)

### Survey Preview

![Teammaking - Survey preview image](assets/TeammakingSurveyPreview.png)

A deadline has to be provided for the survey so that the professor can plan it into his/her schedule.

### Score calculation

 When all of the students have responsed with their answers, the score calculator algorithm can give scores for all students wrt. all other students.

The algorithm takes into account the following aspects apart from the answers themselves:

* Question weight: The question weight on a scale of 1-5 decides how much each answer's score's contribution is to the final score

* Question effect: This aspect decides what effect similar answers to a question has on the final score. The two allowed values are additive or subtractive which means similar scores indicate better match or similar scores indicate worse match respectively. For example: A question about students' programming language preferences will have an additive effect whereas one about their experience may be subtractive as the professor would like the teams to have balanced experience and not have more experienced students be concentrated in some groups and less experienced people be in another.

* Schedule effect: A special question type called schedule-type is also taken into account. However, due to the lack of time, the interface could not be designed for it. The schedule type question asks the students to indicate what hours they are free to meet for group meetings so that people with similar schedules have a chance to be grouped together.

* The answers are all converted to vectors and similarity scores are computed for each answer using linear algebra. Each answer is then multiplied with the weight (sign of which depends on the and the additive/subtractive aspect of the question). The final score is scaled on a scale of 1-100 so that it is easily interpretable. 

Since this was a course project, I mocked students' answers. Using the mocked answers, the scoring algorithm was run on it. The following picture shows the scores for the hypothetical students of the mocked course.

For each student, all the other students' are ordered on the basis of scores and color coded using a red-green spectrum. Greener color indicates better compatibility and red indicates incompatibility. These scores can help the professor create more compatible teams than random grouping.
