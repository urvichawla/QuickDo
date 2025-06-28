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
        successAlert.querySelector('section').textContent = message || 'You are eligible to use Taskify. Welcome aboard!';
        successAlert.style.display = 'block';
        
       
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    } else if (type === 'error') {
        const errorAlert = document.getElementById('errorAlert');
        errorAlert.querySelector('h2').textContent = title || 'Age verification failed';
        errorAlert.querySelector('section').textContent = message || 'You must be at least 10 years old to use this application.';
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
        if (age < 10) {
            const ageError = document.getElementById('ageError');
            ageError.style.display = 'block';
            ageError.style.animation = 'shake 0.5s ease-in-out';
            showAlert('error', `You are ${age} years old. You must be at least 10 years old to use this application.`, 'Age verification failed');
            isValid = false;
        }
    }
    
    if (showDialog) {
        if (typeof showFormAlert === 'function') showFormAlert();
    }
    return isValid;
}


function saveUserData() {
    const name = document.getElementById('userName').value.trim();
    const dob = document.getElementById('userDob').value;
    const age = calculateAge(dob);
    
    const userData = {
        name: name,
        dob: dob,
        registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem('todoUserData', JSON.stringify(userData));
    
  
    showAlert('success', `Great! You are ${age} years old and eligible to use QuickDo.`, 'Age verification passed');
    
    
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    successMessage.style.animation = 'fadeIn 0.5s ease-out';
    successMessage.textContent = 'Registration successful! Redirecting to app...';
    
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.classList.add('loading');
    registerBtn.textContent = 'Setting up your account...';
    
   
    setTimeout(() => {
        window.location.href = 'app.html';
    }, 2000);
    
    console.log('User data saved:', userData);
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
            if (age < 10) {
                const ageError = document.getElementById('ageError');
                ageError.style.display = 'block';
                showAlert('error', `You are ${age} years old. You must be at least 10 years old to use this application.`, 'Age verification failed');
            } else {
                document.getElementById('dobError').style.display = 'none';
                document.getElementById('ageError').style.display = 'none';
                showAlert('success', `Great! You are ${age} years old and eligible to use Taskify.`, 'Age verification passed');
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
            if (age >= 10) {
                document.getElementById('dobError').style.display = 'none';
                document.getElementById('ageError').style.display = 'none';
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
  
    checkExistingUser();
    
  
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('userDob').setAttribute('max', today);
    
  
    addInputValidation();
    
  
    document.getElementById('registerBtn').addEventListener('click', function() {
        if (validateForm()) {
            saveUserData();
        }
    });
    
  
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            saveUserData();
        }
    });
    
  
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});


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