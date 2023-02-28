// pipeline {
//     agent any
//     stages {
//         stage(“Compile & Build Binary”) {
//             parallel {
//                 stage(“Build X”) {
//                      sh(‘cd /path/to/proj-1 && make && make publish’)
//                 }
//                 stage(“Build Y”) {
//                       sh(‘cd /path/to/proj-2 && make && make publish’)
//                 }
//             }
//         }
//     }
// }