function checkExistingUser() {
    const userData = localStorage.getItem('todoUserData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.name && user.dob) {
            
                console.log('User data found:', user);
                window.location.href = 'app.html';
            }
        } catch (e) {
            
            localStorage.removeItem('todoUserData');
        }
    } else {
        console.log('No user data found, showing registration form');
    }
}


function clearUserData() {
    localStorage.removeItem('todoUserData');
 
    document.getElementById('userName').value = '';
    document.getElementById('userDob').value = '';
  
    document.querySelectorAll('.error-message, .success-message').forEach(el => {
        el.style.display = 'none';
    });
    hideAllAlerts();

    const registerBtn = document.getElementById('registerBtn');
    registerBtn.classList.remove('loading');
    registerBtn.textContent = 'Get Started';
    
    console.log('User data cleared, form reset');
    alert('User data cleared! You can now test the registration form.');
}


function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}


function showAlert(type, message, title) {
   
    hideAllAlerts();
    
    if (type === 'success') {
        const successAlert = document.getElementById('successAlert');
        successAlert.querySelector('h2').textContent = title || 'Success! Age verification passed';
        successAlert.querySelector('section').textContent = message || 'You are eligible to use TaskFlow. Welcome aboard!';
        successAlert.style.display = 'block';
        
       
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    } else if (type === 'error') {
        const errorAlert = document.getElementById('errorAlert');
        errorAlert.querySelector('h2').textContent = title || 'Age verification failed';
        errorAlert.querySelector('section').textContent = message || 'You must be above 10 years old to use this application.';
        errorAlert.style.display = 'block';
        
       
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    }
}


function hideAllAlerts() {
    document.getElementById('successAlert').style.display = 'none';
    document.getElementById('errorAlert').style.display = 'none';
}


function validateForm() {
    const name = document.getElementById('userName').value.trim();
    const dob = document.getElementById('userDob').value;
    
    let isValid = true;
    let showDialog = false;
    

    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.style.animation = 'none';
        
        el.offsetHeight;
        el.style.animation = null;
    });
    
    if (!name) {
        const nameError = document.getElementById('nameError');
        nameError.style.display = 'block';
        nameError.style.animation = 'shake 0.5s ease-in-out';
        isValid = false;
        showDialog = true;
    }
    

    if (!dob) {
        const dobError = document.getElementById('dobError');
        dobError.style.display = 'block';
        dobError.style.animation = 'shake 0.5s ease-in-out';
        isValid = false;
        showDialog = true;
    } else {
        const age = calculateAge(dob);
        if (age <= 10) {
            showAlert('error', `You are ${age} years old. You must be above 10 years old to use this application.`, 'Age verification failed');
            isValid = false;
        }
    }
    
    if (showDialog) {
        if (typeof showFormAlert === 'function') showFormAlert();
    }
    return isValid;
}


function saveUserData() {
    console.log('saveUserData called');
    
    if (window.isSavingUserData) {
        console.log('Already saving user data, ignoring duplicate call');
        return;
    }
    
    window.isSavingUserData = true;
    
    const name = document.getElementById('userName').value.trim();
    const dob = document.getElementById('userDob').value;
    const age = calculateAge(dob);
    
    const userData = {
        name: name,
        dob: dob,
        registrationDate: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('todoUserData', JSON.stringify(userData));
        console.log('User data saved to localStorage');
        
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeIn 0.5s ease-out';
        successMessage.textContent = 'Registration successful! Redirecting to app...';
        
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.classList.add('loading');
        registerBtn.textContent = 'Setting up your account...';
        
        setTimeout(() => {
            console.log('Redirecting to app.html');
            try {
                window.location.href = 'app.html';
            } catch (error) {
                window.location.replace('app.html');
            }
        }, 1500);
        
        console.log('User data saved:', userData);
    } catch (error) {
        window.isSavingUserData = false;
        showAlert('error', 'Failed to save user data. Please try again.', 'Registration Error');
    }
}


function addInputValidation() {
    const nameInput = document.getElementById('userName');
    const dobInput = document.getElementById('userDob');
    
    nameInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            const nameError = document.getElementById('nameError');
            nameError.style.display = 'block';
        } else {
            document.getElementById('nameError').style.display = 'none';
        }
    });
    
    dobInput.addEventListener('blur', function() {
        if (this.value === '') {
            const dobError = document.getElementById('dobError');
            dobError.style.display = 'block';
        } else {
            const age = calculateAge(this.value);
            if (age <= 10) {
                showAlert('error', `You are ${age} years old. You must be above 10 years old to use this application.`, 'Age verification failed');
            } else {
                document.getElementById('dobError').style.display = 'none';
                document.getElementById('ageError').style.display = 'none';
            }
        }
    });
 
    nameInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            document.getElementById('nameError').style.display = 'none';
        }
    });
    
    dobInput.addEventListener('input', function() {
        if (this.value !== '') {
            const age = calculateAge(this.value);
            if (age > 10) {
                document.getElementById('dobError').style.display = 'none';
                document.getElementById('ageError').style.display = 'none';
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    checkExistingUser();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('userDob').setAttribute('max', today);
    
    addInputValidation();
    
   
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        
        registerBtn.removeEventListener('click', handleRegisterClick);
        registerBtn.addEventListener('click', handleRegisterClick);
        console.log('Register button event listener added');
    }
    
  
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.removeEventListener('submit', handleFormSubmit);
        registrationForm.addEventListener('submit', handleFormSubmit);
        console.log('Form submit event listener added');
    }
    
  
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});


function handleRegisterClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Register button clicked');
    
   
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn.classList.contains('loading')) {
        console.log('Already processing, ignoring click');
        return;
    }
    
    if (validateForm()) {
        console.log('Form validation passed, saving user data');
        saveUserData();
    } else {
        console.log('Form validation failed');
    }
}


function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn.classList.contains('loading')) {
        console.log('Already processing, ignoring submit');
        return;
    }
    
    if (validateForm()) {
        console.log('Form validation passed, saving user data');
        saveUserData();
    } else {
        console.log('Form validation failed');
    }
}


function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        document.body.style.background = '#fff';
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.body.style.background = '#232946';
    }
}


function initializeTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.background = '#232946';
    } else {
        document.documentElement.classList.remove('dark');
        document.body.style.background = '#fff';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
}); 