import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    sendEmailVerification,

 } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js"

//return an instance of authentication object
const auth = getAuth();

const mainView = document.getElementById("main-view");

const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signup-btn");
const UIErrorMessage = document.getElementById("error-message");

const signUpFormView = document.getElementById("signup-form");
const userProfileView = document.getElementById("user-profile");

const UIuserEmail = document.getElementById("user-email");

const logoutBtn = document.getElementById("logout-btn");

const loginForm = document.getElementById("login-form");

const loginBtn = document.getElementById("login-btn");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

const loginErrorMessage = document.getElementById("login-error-message");

const needAnAccountBtn = document.getElementById("need-an-account-btn");
const haveAnAccountBtn = document.getElementById("have-an-account-btn");

const emailVerificationVIew = document.getElementById("email-verification");

const resendEmailBtn = document.getElementById("resend-email-btn");



//log this guy
onAuthStateChanged(auth,(user)=>{
    console.log(user);
    if(user){

        //email verification
        //user has property emailVerified which is set to false
        if(!user.emailVerified){
            emailVerificationVIew.style.display = "block";
            userProfileView.style.display = "none";
        }else{
            //will be called anytime the authentication state changed
            //checks authentication state when page reloads
            //once account is created hide the sign up and show the profile
            userProfileView.style.display = "block"
            UIuserEmail.innerHTML = user.email; //or user userCredentials if in lower function
            emailVerificationVIew.style.display = "none";

        }
        
        loginForm.style.display = "none";
        signUpFormView.style.display = "none"
        
    }else{

        //signUpFormView.style.display = "block"; instead
        loginForm.style.display = "block"
        userProfileView.style.display = "none"
    }
    mainView.classList.remove("loading");
});



//async is so await works, this it has to be authenticated to work
const signUpButtonPressed = async(e) =>{
    e.preventDefault();
    try{
        const userCredentials = await createUserWithEmailAndPassword(auth,
            email.value,
            password.value);

        await sendEmailVerification(userCredentials.user);


        console.log(userCredentials);

        
    } catch(error){
        console.log(error.code);
        UIErrorMessage.innerHTML = formatErrorMessage(error.code, "signup");
        UIErrorMessage.classList.add('visible');
    }

    
    

};

const logOutButtonPressed = async() =>{
    try {
        //since async use await
        await signOut(auth);
        email.value = "";
        password.value  = "";
        
    } catch (error) {
        console.log(error);    
    }
    
};

const loginButtonPressed = async(e) =>{
    e.preventDefault(); //this to prevent page refresh so I can test console log
    console.log(loginEmail.value);

    try {
        //takes 3 arguments
        //will affect onAuthState
        await signInWithEmailAndPassword(auth,loginEmail.value,loginPassword.value);
        
    } catch (error) {
        console.log(error.code);
        console.log(formatErrorMessage(error.code,"login")); //helps us format to login needs
        loginErrorMessage.innerHTML = formatErrorMessage(error.code,"login");
        loginErrorMessage.classList.add("visible");
    }

    
};

const needAnAccountButtonPressed = () =>{
  loginForm.style.display = "none";
  signUpFormView.style.display = "block";
};

const haveAnAccountButtonPressed = () =>{
    loginForm.style.display = "block";
    signUpFormView.style.display = "none";


};

const resendButtonPressed = async() =>{

    console.log(auth);
    console.log(auth.userCredentials);
    console.log("CHECK2");
    console.log(auth.currentUser);
    console.log("CHECK2");


    await sendEmailVerification(auth.currentUser);
}




signUpBtn.addEventListener("click",signUpButtonPressed);
logoutBtn.addEventListener("click",logOutButtonPressed);
loginBtn.addEventListener("click",loginButtonPressed);
needAnAccountBtn.addEventListener("click",needAnAccountButtonPressed);
haveAnAccountBtn.addEventListener("click",haveAnAccountButtonPressed)
resendEmailBtn.addEventListener("click",resendButtonPressed);

const formatErrorMessage = (errorCode, action) =>{//action will not necessary allows us to know which form the user is interacting with
    let message = "";
    if(action == "signup"){
        if(errorCode == "auth/invalid-email" || errorCode == "auth/missing-email"){
            message = "Please enter valid email";
        } else if(errorCode == "auth/missing-password" || errorCode =="auth/weak-password"){
            message = "Password must be atleast 6 characters long";
        } else if(errorCode == "auth/email-already-in-use"){
            message="Email is already taken";
    
        }
    } else if(action ==="login"){
        if(errorCode == "auth/invalid-email" || errorCode =="auth/invalid-password"){
            message = "Email or Password is incorrect";
        }else if(errorCode == "auth/user-not-found"){
            message = "Our system was unable to verify your email or password";
        }
    }
    
    return message;
};