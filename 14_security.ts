 if (!email.endsWith('@isu.ac.in') || !email.endsWith('@gmail.com')) {
    return { isValid: false, error: 'Only ISU email addresses are allowed' };
  }
