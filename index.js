const express = require('express');
const app = express();
const expressGraphQl = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt
} = require('graphql');
const _ = require('lodash');


const course = require('./Course.json');
const students = require('./Student.json');
const grade = require('./Grade.json');

const studentType = new GraphQLObjectType({
    name: 'Student',
    description: 'Represent students',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        lastname: { type: GraphQLNonNull(GraphQLString)},
        courseID: { type: GraphQLNonNull(GraphQLInt)},
        course:{
            type: courseType,
            resolve: (student) => {
                return course.find(course => course.id === student.courseID)
            }
        }
        
    })
});

const courseType = new GraphQLObjectType({
    name: 'Course',
    description: 'Represent course',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        description: { type: GraphQLNonNull(GraphQLString)}
    })

});

const gradeType = new GraphQLObjectType({
    name: 'Grade',
    description: 'Represent grade',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        courseID: { type: GraphQLNonNull(GraphQLInt)},
        studentID: { type: GraphQLNonNull(GraphQLInt)},
        grade: { type: GraphQLNonNull(GraphQLInt)},
        course:{
            type: courseType,
            resolve: (student) => {
                return course.find(course => course.id === student.courseID)
            }
        },
        student:{
            type: studentType,
            resolve: (student) => {
                return students.find(course => course.id === student.studentID)
            }
        }
    })

});


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        students: {
            type: new GraphQLList(studentType),
            description: 'List of All students',
            resolve: () => students
        },
        courses: {
            type: new GraphQLList(courseType),
            description: 'List of All Courses',
            resolve: () => course
        },
        grades: {
            type: new GraphQLList(gradeType),
            description: 'List of All Grade',
            resolve: () => grade
        },
        student: {
            type: studentType,
            description: 'Particular student',
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => students.find(student => student.id === args.id)
        },
        course:{
            type: courseType,
            description: 'Particular Course',
            args: {
                id:{ type: GraphQLInt}
            },
            resolve: (parent, args) => course.find(cou => cou.id === args.id)
        },
        grade:{
            type: gradeType,
            description: 'Particular Grade',
            args: {
                id:{ type: GraphQLInt}
            },
            resolve: (parent, args) => grade.find(cou => cou.id === args.id)
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addStudent: {
            type: studentType,
            description: 'Add a student',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                lastname: { type: GraphQLNonNull(GraphQLString)},
                courseID: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const stu = {
                    id: students.length + 1,
                    name: args.name,
                    lastname: args.lastname,
                    courseID: args.courseID

                }
                students.push(stu)
                return stu
             }
        },
        addCourse: {
            type: courseType,
            description: 'Add a course',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                description: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const cou = {
                    id: course.length + 1,
                    name: args.name,
                    description: args.description
                }
                course.push(cou)
                return cou
             }
        },
        addGrade: {
            type: gradeType,
            description: 'Add a grade',
            args: {
                courseID: { type: GraphQLNonNull(GraphQLInt)},
                studentID: { type: GraphQLNonNull(GraphQLInt)},
                grade: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const gra = {
                    id: grade.length + 1,
                    courseID: args.courseID,
                    studentID: args.studentID,
                    grade: args.grade
                }
                grade.push(gra)
                return gra
             }
        },
        deleteStudent:{
            type: studentType,
            description: 'delete a student',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const stu = {
                    id: args.id
                }

                const gra = {
                    studentID: args.id
                }
                _.remove(students, stu);
                _.remove(grade, gra);
                return stu
             }
        },
        deletecourse:{
            type: courseType,
            description: 'delete a course',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const cour = {
                    id: args.id

                }
                _.remove(course, cour)
                return cour
             }
        },
        deletegrade:{
            type: gradeType,
            description: 'delete a grade',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const cour = {
                    id: args.id

                }
                
                _.remove(grade, cour)
                return cour
             }
        }
    })
})



const schema = new GraphQLSchema ({
    query: RootQueryType,
    mutation: RootMutationType
});

app.use('/graphql', expressGraphQl({
    schema: schema,
    graphiql : true
}));


app.listen(3000, () => {
    console.log('Server running');
});