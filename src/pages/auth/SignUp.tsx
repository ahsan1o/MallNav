// ... existing imports ...

export function SignUp() {
  // ... existing state ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = {
      firstName: validateName(firstName, 'First name'),
      lastName: validateName(lastName, 'Last name'),
      email: validateEmail(email),
      password: validatePassword(password),
      submit: null
    };

    setErrors(formErrors);

    if (Object.values(formErrors).some(error => error !== null)) {
      return;
    }

    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, submit: null }));

      // Sign up the user
      const { data: authData, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        }
        throw signUpError;
      }

      if (authData.user) {
        // Create user profile without email field
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            user_id: authData.user.id,
            first_name: firstName,
            last_name: lastName
          }]);

        if (profileError) throw profileError;

        navigate('/mall-selection', {
          state: { message: 'Account created successfully! Please verify your email to continue.' }
        });
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrors(prev => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Failed to create account'
      }));
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same ...
}