-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS public.service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    project_date DATE NOT NULL,
    -- This constraint links the project to the organization
    CONSTRAINT fk_organization
        FOREIGN KEY(organization_id) 
        REFERENCES public.organization(organization_id)
        ON DELETE CASCADE
);

-- Step 2: Insert sample data
INSERT INTO public.service_project 
(organization_id, title, description, location, project_date)
VALUES 
-- Projects for Organization 1
(1, 'Community Garden Planting', 'Help us plant spring vegetables.', 'Downtown Park', '2026-04-10'),
(1, 'Park Bench Painting', 'Refreshing the benches at South Park.', 'South Park', '2026-04-12'),
(1, 'River Cleanup', 'Removing debris from the riverbank.', 'East River', '2026-04-15'),
(1, 'Tree Pruning Workshop', 'Learn to care for urban trees.', 'City Library', '2026-04-20'),
(1, 'Flower Bed Mulching', 'Protecting the flower beds for summer.', 'Main St Plaza', '2026-04-25'),

-- Projects for Organization 2
(2, 'Food Drive Sorting', 'Organizing donated canned goods.', 'Warehouse B', '2026-05-01'),
(2, 'Hot Meal Service', 'Serving lunch to community members.', 'Community Center', '2026-05-02'),
(2, 'Pantry Shelf Building', 'Assembling new shelves for the pantry.', 'Warehouse B', '2026-05-05'),
(2, 'Donation Pickup', 'Collecting items from local grocery stores.', 'Varies', '2026-05-07'),
(2, 'Nutrition Class Help', 'Assisting the instructor with materials.', 'Community Center', '2026-05-10'),

-- Projects for Organization 3
(3, 'Tutoring Session', 'Helping students with math homework.', 'Education Hub', '2026-06-01'),
(3, 'Library Book Repair', 'Mending torn pages and covers.', 'Main Library', '2026-06-03'),
(3, 'Youth Mentorship Kickoff', 'Introductory meeting for mentors.', 'Youth Center', '2026-06-05'),
(3, 'Summer Reading Sign-up', 'Helping kids register for the program.', 'Education Hub', '2026-06-08'),
(3, 'Backpack Stuffing', 'Filling bags with school supplies.', 'Youth Center', '2026-06-15');