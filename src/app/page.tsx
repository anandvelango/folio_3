// set this to a client component (to enable user interaction/event handling on browser)
"use client";

// import all the required files, components and hooks
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sign Up component
export default function Page(){

  // useState hook to store the user's input (username, password, confirm password)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  // useState hook to gather errors upon sign up to be used and display the error messages to the user
  const [error, setError] = useState('');

  // useState hook to store the user's sign up success
  const [isSuccess, setIsSuccess] = useState(false);

  // whenever the input field changes, the values are reassigned back to the state
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  // handle submit event called when user submits the field
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // ensures all fields are entered
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    // checks if the username has length between 5-20 characters, includes only alphanumeric characters and underscores and at least one character must be alphanumeric
    if (!formData.username.match(/^[a-zA-Z0-9][a-zA-Z0-9_]{4,19}$/)) {
      setError('Username must be 5-20 characters long and contain only letters, numbers, and underscores. Must start with a letter or number.');
      return;
    }

    // check if password contains spaces
    if (formData.password.includes(' ')) {
      setError('Password cannot contain spaces');
      return;
    }

    // check if password is same as username
    if (formData.password === formData.username) {
      setError('Password cannot be the same as username');
      return;
    }

    // checks if password meets has a minimum of 8 characters, at least one uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)');
      return;
    }

    // checks if the password matches the confirmed password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // if all validations check, redirect user to a success sign up page and save credentials
    try {
      const response = await fetch('/api/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('Username already exists. Please choose a different username.');
          return;
        }
        throw new Error('Failed to save credentials');
      }

      setIsSuccess(true);
    } catch (err) {
      setError('An error occurred while saving your credentials');
      return;
    }
  };

  // reset form when user clicks on "Back to Sign Up" button again
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    setIsSuccess(false);
    setError('');
  };

  // leads to a sign up success page if the user is signed up successfully
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Sign Up Successful!</CardTitle>
            <CardDescription>
              Thank you for creating your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={resetForm} className="mt-4">
              Back to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // sign up html page
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* form inputs and fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

