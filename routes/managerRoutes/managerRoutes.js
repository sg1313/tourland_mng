const express = require('express');
const router = express.Router();
const sequelize = require("sequelize");
const Op = sequelize.Op;

const cookieParser = require("cookie-parser");
const models = require("../../models");
const fs = require('fs');
const querystring = require('querystring');
const crypto = require('crypto'); //추가됐음
const {getPagingData, getPagination} = require('../../controller/pagination');
const {makePassword, comparePassword} = require('../../controller/passwordCheckUtil');


router.get('/statistics', (req,res,next)=>{

    let Manager = {};
    let Auth = {};

    res.render("manager/main/statistics",{Manager, Auth});
})

router.get('/employeeMngList/:empretired', async (req,res,next)=>{
        //empretired 정상사원, 퇴사사원 구분

        const empretired = req.params.empretired;
        let { searchType, keyword } = req.query;

        const contentSize = Number(process.env.CONTENTSIZE); // 한페이지에 나올 개수
        const currentPage = Number(req.query.currentPage) || 1; //현재페이지
        const { limit, offset } = getPagination(currentPage, contentSize);

        keyword = keyword ? keyword : "";

        let dataAll = await models.employee.findAll({
            where: {
                [Op.and] : [
                    {
                        empretired: empretired
                    }
                ],
                [Op.or]: [
                    {
                        empid: { [Op.like]: "%" +keyword+ "%" }
                    },
                    {
                        empname: { [Op.like]: "%" + keyword + "%" }
                    }
                ]

            },
            limit, offset
        })

        let dataCountAll = await models.employee.findAndCountAll({
            where: {
                [Op.and] : [
                    {
                        empretired: empretired
                    }
                ],
                [Op.or]: [
                    {
                        empid: { [Op.like]: "%" +keyword+ "%" }
                    },
                    {
                        empname: { [Op.like]: "%" + keyword + "%" }
                    }
                ]
            },
            limit, offset
        })

        const pagingData = getPagingData(dataCountAll, currentPage, limit);

        let cri = {searchType,keyword};

        let btnName = (Boolean(Number(empretired)) ? "직원 리스트" : "퇴사사원 조회");

        console.log("usersecbtt->", btnName)
        let Manager = {};
        let Auth ={};
        let list = dataAll;

    res.render("manager/employee/employeeMngList",{cri, list, btnName, pagingData, Manager, empretired, Auth});
})

router.get('/employeeDetailForm/:empretired', async (req,res,next)=> {
    //empretired 일반사원, 퇴사사원 구분

    console.log("33333333333333333333");
    const empretired = req.params.empretired;
    let { no, currentPage, searchType, keyword } = req.query;

    let empVO = await models.employee.findOne({
        raw : true,

        where : {empno : no}
    })
    console.log("empid->", empVO);

    let cri = {};
    let Manager = {};
    let Auth = {};
    let success ="";

    res.render("manager/employee/employeeDetailForm", {empVO, cri, Manager, Auth, empretired,success});
});

router.post('/employeeDetailForm/:empretired', async (req,res,next)=> {
    //empretired 일반사원, 퇴사사원 구분

    console.log("33333333333333333333");
    const {empretired, empno, empname, empbirth, emptel, empaddr, empauth, empid} = req.params;
    let { no, currentPage, searchType, keyword } = req.query;

    let empVO = await models.employee.findOne({
        raw : true,

        where : {empno : no}
    })
    console.log("empid->", empVO);

    let cri = {};
    let Manager = {};
    let Auth = {};
    let success ="";

    res.render("manager/employee/employeeDetailForm", {empVO, cri, Manager, Auth, empretired,success});
});

router.get('/manager/employeeMngList/:empretired', (req,res,next)=>{

    let Manager = {};
    let Auth = {};

    res.render("manager/employee/employeeRegister",{Manager, Auth, empretired});
})

router.get('/userMngList/:usersecess', async (req,res,next)=>{
    //usersecess 정상회원, 탈퇴회원 구분

    const usersecess = req.params.usersecess;
    let { searchType, keyword } = req.query;

    const contentSize = Number(process.env.CONTENTSIZE); // 한페이지에 나올 개수
    const currentPage = Number(req.query.currentPage) || 1; //현재페이
    const { limit, offset } = getPagination(currentPage, contentSize);

    keyword = keyword ? keyword : "";

    let dataAll = await models.user.findAll({
        where: {
            [Op.and] : [
                {
                    usersecess: usersecess
                }
            ],
            [Op.or]: [
                {
                    userid: { [Op.like]: "%" +keyword+ "%" }
                },
                {
                    username: { [Op.like]: "%" + keyword + "%" }
                }
            ]

        },
        limit, offset
    })

    let dataCountAll = await models.user.findAndCountAll({
        where: {
            [Op.and] : [
                {
                    usersecess: usersecess
                }
            ],
            [Op.or]: [
                {
                    userid: { [Op.like]: "%" +keyword+ "%" }
                },
                {
                    username: { [Op.like]: "%" + keyword + "%" }
                }
            ]
        },
        limit, offset
    })

    const pagingData = getPagingData(dataCountAll, currentPage, limit);

    let cri = {searchType,keyword};

    let btnName = (Boolean(Number(usersecess)) ? "회원 리스트" : "탈퇴회원 조회");

    console.log("usersecbtt->", btnName)
    let Manager = {};
    let Auth ={};
    let list = dataAll;

    res.render("manager/user/userMngList",{cri, list, btnName, pagingData, Manager, usersecess, Auth});
})



router.get('/userDetailForm/:usersecess', async (req,res,next)=> {
    //usersecess 정상회원, 탈퇴회원 구분
    const usersecess = req.params.usersecess;
    let { no, currentPage, searchType, keyword } = req.query;

    let userVO = await models.user.findOne({
        raw : true,

        where : {userno : no}
    })
    console.log("userid->", userVO);

    let cri = {};
    let Manager = {};
    let Auth = {};
    let couponLists =[{}];

    res.render("manager/user/userDetailForm", {userVO, cri, Manager, Auth, usersecess,couponLists});
});

// / ✈️  productfilightMngList----------------------------------------------------

router.get('/flightMngList', async (req,res,next)=>{


    let { searchType, keyword } = req.query;

    const contentSize = Number(process.env.CONTENTSIZE); // 한페이지에 나올 개수
    const currentPage = Number(req.query.currentPage) || 1; //현재페이지
    const { limit, offset } = getPagination(currentPage, contentSize);

    keyword = keyword ? keyword : "";

    let dataAll = await models.user.findAll({
        where: {

            // [Op.or]: [
            //     {
            //         userid: { [Op.like]: "%" +keyword+ "%" }
            //     },
            //     {
            //         username: { [Op.like]: "%" + keyword + "%" }
            //     }
            // ]

        },
        limit, offset
    })

    let dataCountAll = await models.user.findAndCountAll({
        where: {

            // [Op.or]: [
            //     {
            //         userid: { [Op.like]: "%" +keyword+ "%" }
            //     },
            //     {
            //         username: { [Op.like]: "%" + keyword + "%" }
            //     }
            // ]
        },
        limit, offset
    })

    const pagingData = getPagingData(dataCountAll, currentPage, limit);

    let cri = {searchType,keyword};


    console.log("usersecbtt->")
    let Manager = {};
    let Auth ={};
    let list = dataAll;

    res.render("manager/product/flightMngList",{cri, list,  pagingData, Manager, Auth});
})

// 🏨 호텔 관리 -------------------
// 🚩 투어 관리 -------------------
// 🚗 렌트카 관리-----------------



// 공지사항 관리 ------------------------------------------
router.get('/noticeMngList', async (req, res, next) => {

    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    const usersecess = req.params.usersecess;
    let { searchType, keyword } = req.query;

    const contentSize = 5 // 한페이지에 나올 개수
    const currentPage = Number(req.query.currentPage) || 1; //현재페이
    const { limit, offset } = getPagination(currentPage, contentSize);

    keyword = keyword ? keyword : "";
    let cri = {currentPage};

    let noticeFixedList =
        await models.notice.findAll({
            raw : true,
            where : {
                fixed : 1
            },
            limit, offset
        });
    console.log('====',noticeFixedList);


    let noticeNoFixedList =
        await models.notice.findAll({
            raw : true,
            where : {
                fixed: 0
            },
            order : [
                ["regdate", "DESC"]
            ],
            limit, offset
        });

    let noticeNoFixedCountList =
        await models.notice.findAndCountAll({
            raw : true,
            where : {
                fixed: 0
            },
            order : [
                ["regdate", "DESC"]
            ],
            limit, offset
        });

    const pagingData = getPagingData(noticeNoFixedCountList, currentPage, limit);
    console.log('---------', noticeNoFixedList);

    res.render("manager/notice/noticeMngList", {Manager, Auth, cri, noticeFixedList, noticeNoFixedList, pagingData});
})

//공지사항 추가하는 화면
router.get('/addNoticeForm', (req, res, next) => {
    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let totalCnt = {};

    res.render('manager/notice/addNoticeForm', {Manager, Auth, totalCnt});
})

//공지사항 추가하기
router.post('/addNoticeForm', async (req, res, next) => {
    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let totalCnt = {};

// ------------------공지 등록하면 공지사항도 같이 보여줘야함-----------------------------------
    const usersecess = req.params.usersecess;
    let { searchType, keyword } = req.query;

    const contentSize = 5 // 한페이지에 나올 개수
    const currentPage = Number(req.query.currentPage) || 1; //현재페이
    const { limit, offset } = getPagination(currentPage, contentSize);

    keyword = keyword ? keyword : "";

    let cri = {currentPage};

    let body = {};
    let isChecked = req.body.fixed;
    if (isChecked != true) {
        body = {
            raw: true,
            fixed : 0,
            title : req.body.title,
            writer : req.body.writer, //투어랜드 hidden 되어있음
            content : req.body.content,
        }
    } else {
        body= {
            raw: true,
            fixed : 1,
            title : req.body.title,
            writer : req.body.writer, //투어랜드 hidden 되어있음
            content : req.body.content,
        }
    }
    const noticeRegister = await models.notice.create(body);

    let noticeFixedList =
        await models.notice.findAll({
            raw : true,
            where : {
                fixed : 1
            },
            limit, offset
        });
    console.log('====',noticeFixedList);
    let noticeNoFixedList =
        await models.notice.findAll({
            raw : true,
            where : {
                fixed: 0
            },
            order : [
                ["regdate", "DESC"]
            ],
            limit, offset
        });
    let noticeNoFixedCountList =
        await models.notice.findAndCountAll({
            raw : true,
            where : {
                fixed: 0
            },
            order : [
                ["regdate", "DESC"]
            ],
            limit, offset
        });

    const pagingData = getPagingData(noticeNoFixedCountList, currentPage, limit);
    console.log('---------', noticeNoFixedList);


    res.render('manager/notice/noticeMngList', {Manager, Auth, totalCnt, noticeRegister, pagingData, noticeNoFixedCountList, noticeNoFixedList, noticeFixedList, cri});
})


// 공지사항 읽기
router.get('/noticeDetail', async (req, res, next) => {

    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let cri = {};
    const notice = await models.notice.findOne({
        raw: true,
        where: {
            no : req.query.no
        }
    });

    res.render("manager/notice/noticeDetail", {Manager, Auth, notice, cri});
})


// 공지사항 수정하기
router.get('/editNotice', async (req, res, next) => {
    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let cri = {};
    const notice = await models.notice.findOne({
        where: {
            no : req.query.no
        }
    });
    console.log('-------수정화면입장----------', notice);

    res.render("manager/notice/editNotice", {Manager, Auth, cri, notice});
})

// 공지사항 수정하기 전송
router.post('/editNotice', async (req, res, next) => {
    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let cri = {};
    const update = await models.notice.update({
        title : req.body.title,
        content : req.body.content,
        fixed : req.body.fixed
    }, {
        where : {
            no : req.body.no
        }
    });

    // 수정하고 수정된 페이지 보여줘야 하니까
    const notice = await models.notice.findOne({
        where: {
            no : req.body.no
        }
    });

    console.log('---------req.body------', req.body);
    console.log('-------수정하기----------', update);

    res.render("manager/notice/noticeDetail", {Manager, Auth, cri, update, notice});
});


// 공지사항 삭제하기
router.delete('/removeNotice', async (req, res, next) => {
    // header 공통 !!!
    let Manager = {};
    let Auth = {};

    let cri = {};
    models.notice.destroy({
        where: {
            no : req.query.no,
        }
    }).then( (result) => {
        console.log('----------삭제되었습니다------->', result);
    }).catch( (err) => {
        console.log('삭제 실패!!', err);
        next(err);
    })

    res.render('manager/notice/noticeMngList', {Manager, Auth, cri})
})

// 로그인폼------------------------------------------------
router.get('/loginForm', async (req,res,next)=> {
    let { registerSuccess, id} = req.query;

    let UserStay = {userid:id};

    let EmpStay = {};
    let error = "";
    let Auth ={};
    let login ="";
    let Manager = {};
    let searchkeyword = "";


    res.render("user/tourlandLoginForm", {Auth,login, Manager,searchkeyword, registerSuccess, UserStay, EmpStay, error});
});



router.post('/loginForm', async (req,res,next)=> {
    let { id, pass} = req.body;
    console.log("loginForm->", id, pass)
    if(id == null) res.status(400).send('idempty');
    if(pass == null) res.status(400).send('passempty');


    if( id !== null && pass !=null){
        // ID,PASS가 입력된 경우
        let userVO = models.user.findOne({
            raw : true,
            attributes: ['userpass','usersecess'],
            where : {
                userid : id
            }
        })

        // 직원 ID가 없는 경우
        if(userVO == null) res.status(402).send("idnoneexist");
        // 직원 ID가 있는 경우
        if(userVO != null && userVO.usersecess != 1){
            res.status(402).send("retiredemployee");
        }
        if(userVO != null && userVO.usersecess == 0){
            if(comparePassword(userVO.userid, pass)){
                res.redirect('/tourlandMain?');
            }
            else{
                res.status(405).send("passwdnotequal");
            }
        }

    }

    let empVO ={};
    let session = {};

    let registerSuccess = {};
    let UserStay = {};
    let EmpStay = {};
    let error = "";
    let Auth ={};
    let login ="";
    let Manager = {};
    let searchkeyword = "";

    res.render("user/tourlandLoginForm", {Auth,login, Manager,searchkeyword, registerSuccess, UserStay, EmpStay, error});
});



router.post('/loginForm', async (req,res,next)=> {
    let { registerSuccess, id} = req.query;
    let EmpStay = {};
    let error = "";
    let Auth ={};
    let login ="";
    let Manager = {};
    let searchkeyword = "";


    res.render("user/tourlandLoginForm", {Auth,login, Manager,searchkeyword, registerSuccess, UserStay, EmpStay, error});
});


router.get('/employee/idCheck/:userid', async (req,res,next)=> {

    const userid = req.params.userid;

    try{
        let checkUserid = await models.employee.findOne({
            raw: true,
            attributes : ['empid'],
            where : {
                userid : userid
            }
        })

        if( checkUserid != null)
        {
            console.log("check->", checkUserid.empid);
            if( checkUserid.empid != null) {
                res.status(200).send("exist");
            }
        }
        else{
            res.status(200).send("notexist");
        }
    }
    catch (e){
        console.error(e);
        next(e);
    }

});


router.get('/tourlandRegister', async (req,res,next)=> {
    let autoNo = "";

    res.render("user/tourlandRegisterForm", {autoNo});

});


module.exports = router;
