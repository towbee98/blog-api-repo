const UserRepo= require("../repository/userRepo");
const BlogRepo=require("../repository/blogRepo");

exports.home=async(req,res,next)=>{
    const data=await BlogRepo.getAllBlogs();
    res.status(200).render("index",{title:"Home Page",message:"Latest Stories",user:req.user,stories:data})
}

exports.login=(req,res)=>{
    res.status(200).render("login",{title:"Sign In",message:"Sign in Page",user:req.user});
}

exports.logout=(req,res)=>{
    req.logout();
    res.status(200).redirect("/")
}
exports.authCheck= (req,res,next)=>{
    console.log(req.headers.cookie.split(";"))
    req.user?next():res.redirect("/auth/login") 
}

exports.callback=(req,res)=>{
    res.status(302).redirect("/")
}

exports.create=(req,res)=>{
    res.status(200).render("createBlog",{user:req.user})
}
