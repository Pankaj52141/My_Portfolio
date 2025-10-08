const NotAllowed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-5xl font-bold gradient-text mb-6">Access Denied</h1>
      <p className="text-xl max-w-xl text-center">You are not authorized to view the Dark Lab.Verify your identity  to gain access.</p>
      <img src="/pankaj.png" alt="Not Allowed" className="w-40 h-40 mt-8 rounded-full shadow-lg" />
    </div>
  );
};

export default NotAllowed;
