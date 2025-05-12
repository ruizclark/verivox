VIDEO: https://youtu.be/8dh_NHnHNPg

Due to the size of my repository, it was not possible to upload a zipped folder. Given this, I ask that the teaching team review my code in GitHub, which can be found at: https://github.com/ruizclark/verivox. NOTE: I would like to continue making improvements to VERIVOX after CS50 so that I can share the platform with my doctoral program. However, I will pause my development starting at 11:59pm on March 11th until my grade for CS50 is released.

OVERVIEW: 

    VERIVOX is a platform designed for current students and alumni affiliated with the Doctoral program for Education Leadership (EdLD) at the Harvard Graduate School of Education (HGSE). It is intended to be space where they can "amplify their voices," by showcasing their experience and publish onlines articles. It is a mix between Facebook/LinkedIn and Medium, but specifically created for the EdLD community. I used branding that is Harvard-adjacent, but created my own VERIVOX shield. While this is a student-led initiative that is independent from the university, it is designed specifically for students and alumni from my program.

WALKTHROUGH: 

    Eventually, VERIVOX will be live at www.verivox.space (a domain that I purchased). However, for now, the project is deployed at https://verivox-mu.vercel.app/. On the homepage, you will see links that lead to the member profiles, the published articles, as well as an "About" page. The homepage also autopopulates with the most recently registered member profiles and new articles. 

REGISTRATION TEST: 

    To register as a new user, first go to "Signup" in the header. You will be prompted to provide an email and create a password. An email will then be sent to the address for verification. Follow the link provided, and you will be redirected to the registration page. Please fill out all of the required sections. Once you submit, your profile will be under review. The reason for this approach is that HGSE alumni no longer have a university-affiliated email address. As such, there is no quick way to verify a user's connection to the EdLD program other than checking their résumé and LinkedIn profile. NOTE: At the time of submission, I kept running into an unexpected row-level security (RLS) conflict in Supabase with the profile PhotoUpload component (it had previously worked). As such, as of right now, members are not able to upload profile photos yet. Instead, a placeholder image will appear. I will try to fix this program ASAP.

APPROVAL TEST: 

    So that the teaching team is able to view the approval process, a pseudo profile has been created. Please login to VERIVOX as verivoxCS50@gmail.com (NOTE: The password is in the README.md submitted through Gradescope). Once logged in, you will have admin privileges. Go to https://verivox-mu.vercel.app/admin/approvals. Please feel free to approve the test profile that you created in the last step.

PUBLICATION TEST: 

    Now that you have create a new user and the profile has been approved, logout as an administrator and login as the new user. In the header, you should now see "New Article" (this button only appears for authenticated users). Click on the button, and you will be able to write an article with rich text formatting. You can also include a banner for the article using a URL link. If you do not provide a photo, a pre-set VERIVOX banner will post instead. When you click "Publish," the article should appear on the homepage as a featured article, and it should also appear under "Articles" as well as your own profile page. 

LOCAL HOST: 

    It is highly recommended that you test VERIVOX on the deployed site itself (I personally found the database configuration to be veeery finicky and replication could lead to errors). However, if you wish to test VERIVOX on your local server, first enter the following into your terminal: 

        git clone https://github.com/your-username/verivox.git
        cd verivox

    In order to set up your databases, it is recommended that you create a free Supabase account. Once you have done that, replicate the databases used by VERIVOX by using the code in migrations.sql. Then, create your own .env.local file in the root directory. In the .env file, you will then need to populate it with the following information from your Supabase account (for help, check out: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs):

        NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
        SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret

    Then, make sure to install dependencies: 

        pnpm install
    
    Once you have created the .env file with the necessary information, start the dev server by typing the following into your terminal:

        pnpm dev

    Your app should be running at http://localhost:3000. 

UNFINISHED FEATURES: 

    It is my hope to turn VERIVOX into a full-fledged platform that can  used by my doctoral program. Given this, even after CS50 concludes, I intend to continue making improvements. Here are the features that I was not able to complete before the deadline that I hope to build this summer: 

        •	Fix RLS conflicts so that users can upload a profile image
        •	Create pages for “Privacy Policy” and “Terms and Conditions”
        •	Build a page that allows users to update their profile
        •	Connect domain name with deployed site
        •	Set up an email account using domain name
        •	Setup SendGrid to trigger email notifications for profile review
        •	Build a forum where  members can post opportunities
        •	Create "work experience" section of the member profiles
