import React, {useState, useEffect} from 'react';

//type definition
 type ProfileData = {
    username: string;
    email: string;
    school: string;
    grade: string;
    section: string;
    scores: {subject: string; score: number; date:string}[];

 }

 const API_URL = 'http://localhost:4000/api/endPoints';


const ProfilePage: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // The browser automatically sends the cookie, so we don't need to manage tokens here
        const response = await fetch(`${API_URL}/profile`, { credentials: 'include' });
        
        if (response.status === 401) {
          throw new Error('You must be logged in to view this page.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch profile data.');
        }
        
        const data: ProfileData = await response.json();
        setProfile(data);
        setFormData(data); // Pre-fill the form with existing data
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important: This tells fetch to send cookies
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile.');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false); // Exit edit mode
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading profile...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center p-8">Could not load profile data.</div>;
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
        <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-lg shadow-xl p-8 mb-8'>
                <div className='flex justify-between items-center border-b pb-4 mb-6'>
                    <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
                    {isEditing ? (
                        <div className='space-x-2'>
                            <button onClick={()=> {setIsEditing(false); setFormData(profile); }} className='text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100'>Cancel</button>
                            <button onClick={handleSave} className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>Save Changes</button>
                        </div>
                    ) : (
                        <button onClick={()=> setIsEditing(true)} className='text-blue-600 font-semibold'>Edit Profile</button>
                    )}

                </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-5xl text-white font-bold" style={{backgroundColor: '#3b82f6'}}>
                {profile.username.charAt(0).toUpperCase()}
              </div>
              {isEditing && <button className="text-sm text-blue-500 hover:underline">Change Photo</button>}
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                {isEditing ? <input type="text" name="username" value={formData.username || ''} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p className="text-xl text-gray-900">{profile.username}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="text-lg text-gray-600">{profile.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">School</label>
                  {isEditing ? <input type="text" name="school" value={formData.school || ''} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p className="text-lg">{profile.school || 'Not set'}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Grade</label>
                  {isEditing ? <input type="text" name="grade" value={formData.grade || ''} onChange={handleInputChange} className="w-full p-2 border rounded"/> : <p className="text-lg">{profile.grade || 'Not set'}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam History Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Exam History</h2>
          {profile.scores && profile.scores.length > 0 ? (
            <ul className="space-y-4">
              {profile.scores.map((exam, index) => (
                <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-700">{exam.subject || 'General Quiz'}</p>
                    <p className="text-sm text-gray-500">
                      Taken on: {new Date(exam.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-blue-600">{exam.score}%</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">You haven't taken any exams yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage