/**
 * Main entry point for the web app
 * Returns the HTML interface
 */
function doGet(e) {
  return HtmlService.createHtmlOutput(getIndexHtml())
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Returns the HTML content from index.html
 */
function getIndexHtml() {
  return `<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        /* ===== LOGIN PAGE STYLES ===== */
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-box {
            background-color: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }

        .login-box h1 {
            text-align: center;
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }

        .login-box .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: bold;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            box-sizing: border-box;
        }

        .form-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
        }

        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .password-wrapper input {
            width: 100%;
            padding-right: 40px;
        }

        .password-toggle {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            font-size: 18px;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
        }

        .password-toggle:hover {
            color: #333;
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            background-color: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .btn-login:hover {
            background-color: #5568d3;
        }

        .btn-login:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        .login-message {
            padding: 12px;
            margin: 15px 0 0 0;
            border-radius: 4px;
            text-align: center;
            display: none;
            font-size: 14px;
        }

        .login-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }

        .login-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }

        .loading-spinner {
            display: none;
            text-align: center;
            margin-top: 10px;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* ===== MAIN APP STYLES ===== */
        .app-container {
            display: none;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .app-header {
            background-color: #667eea;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .app-header h2 {
            margin: 0;
        }

        .app-header .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .user-info .user-name {
            font-weight: bold;
            font-size: 16px;
        }

        .user-info .user-role {
            font-size: 12px;
            opacity: 0.9;
        }

        .btn-logout {
            background-color: #ff6b6b;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }

        .btn-logout:hover {
            background-color: #ee5a52;
        }

        /* ===== SIDEBAR STYLES ===== */
        .app-body {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .sidebar {
            width: 250px;
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            overflow-y: auto;
            border-right: 2px solid #667eea;
        }

        .sidebar h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #667eea;
            font-size: 16px;
            text-transform: uppercase;
        }

        .sidebar-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 30px;
        }

        .btn-sidebar {
            padding: 12px;
            background-color: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            width: 100%;
        }

        .btn-sidebar:hover {
            background-color: #5568d3;
            transform: translateX(5px);
        }

        .saved-projects-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 400px;
            overflow-y: auto;
        }

        .saved-project-item {
            padding: 10px;
            background-color: #34495e;
            border-left: 3px solid #667eea;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.3s ease;
            word-break: break-word;
            font-size: 13px;
        }

        .saved-project-item:hover {
            background-color: #445566;
            transform: translateX(5px);
        }

        .saved-project-item.active {
            background-color: #667eea;
            border-left-color: #ffffff;
        }

        .saved-projects-label {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 12px;
            color: #bbb;
            text-transform: uppercase;
        }

        .no-saved-projects {
            color: #999;
            font-size: 12px;
            padding: 10px;
            text-align: center;
        }
        
        .main-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            background-color: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
        }
        
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        
        .header-section {
            border: 2px solid #333;
            margin-bottom: 30px;
            padding: 0;
        }
        
        .header-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 2px solid #333;
        }
        
        .header-row:last-child {
            border-bottom: none;
        }
        
        .header-item {
            display: grid;
            grid-template-columns: 200px 1fr;
            border-right: 2px solid #333;
            min-height: 50px;
        }
        
        .header-item:nth-child(2n) {
            border-right: none;
        }
        
        .header-label {
            background-color: #f0f0f0;
            padding: 12px;
            font-weight: bold;
            border-right: 1px solid #ccc;
            display: flex;
            align-items: center;
        }
        
        .header-input {
            padding: 12px;
            border: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
        
        .header-input input, .header-input select {
            width: 100%;
            border: none;
            font-size: 14px;
            padding: 5px;
            text-align: left;
        }
        
        .table-section {
            margin-top: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            table-layout: fixed;
        }
        
        th {
            background-color: #4a90e2;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #333;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        th.col-item,
        th.col-description,
        th.col-qty,
        th.col-unit {
            text-align: center;
        }
        
        td {
            padding: 10px 12px;
            border: 1px solid #ddd;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        
        .col-item {
            width: 60px;
            text-align: center;
        }
        
        .col-description {
            width: 55%;
            text-align: left;
        }
        
        .col-qty {
            width: 12%;
            text-align: center;
        }
        
        .col-unit {
            width: 12%;
            text-align: center;
        }
        
        .col-action {
            width: 10%;
            text-align: center;
        }
        
        .division-header {
            background-color: #d3d3d3;
            font-weight: bold;
            color: #333;
        }
        
        .division-header td {
            padding: 8px 12px;
            vertical-align: middle;
            background-color: #d3d3d3;
        }

        .division-action-row {
            background-color: #e8e8e8;
            text-align: right;
            height: 24px;
        }

        .division-action-row td {
            padding: 2px 6px;
            background-color: #e8e8e8;
            height: 24px;
            vertical-align: middle;
        }

        .division-action-row .col-action {
            text-align: center;
        }
        
        .item-row {
            background-color: #ffffff;
        }
        
        .item-row td {
            background-color: #ffffff;
            border: 1px solid #ddd;
        }

        .item-row:hover {
            background-color: #f9f9f9;
        }
        
        input[type="text"], input[type="number"], select {
            width: 100%;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            box-sizing: border-box;
            text-align: center;
        }

        .col-description input[type="text"],
        .col-description select {
            text-align: left;
        }
        
        input[type="text"]:focus, input[type="number"]:focus, select:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
        }

        input:disabled, select:disabled {
            background-color: #e8e8e8;
            color: #333;
            cursor: not-allowed;
        }
        
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        button {
            padding: 10px 20px;
            font-size: 14px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        .btn-add {
            background-color: #27ae60;
            color: white;
        }
        
        .btn-add:hover {
            background-color: #229954;
        }

        .btn-add-row {
            background-color: #27ae60;
            color: white;
            padding: 3px 8px;
            font-size: 11px;
            white-space: nowrap;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: fit-content;
            width: auto;
            height: 24px;
            line-height: 18px;
        }

        .btn-add-row:hover {
            background-color: #229954;
        }
        
        .btn-remove {
            background-color: #e74c3c;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            white-space: nowrap;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: fit-content;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .btn-remove:hover {
            background-color: #c0392b;
        }

        .btn-delete-item {
            background-color: #e74c3c;
            color: white;
            padding: 6px 12px;
            font-size: 12px;
            white-space: nowrap;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: fit-content;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-delete-item:hover {
            background-color: #c0392b;
        }
        
        .btn-save {
            background-color: #4a90e2;
            color: white;
        }
        
        .btn-save:hover {
            background-color: #3775c1;
        }
        
        .btn-export {
            background-color: #f39c12;
            color: white;
        }
        
        .btn-export:hover {
            background-color: #d68910;
        }
        
        .message {
            padding: 12px;
            margin: 10px 0;
            border-radius: 4px;
            text-align: center;
            display: none;
        }
        
        .message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        
        .message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #999;
        }

        .empty-state p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .division-description-cell {
            width: 100%;
            text-align: left;
        }

        .division-description-cell select {
            width: 100%;
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            font-weight: normal;
            background-color: #d3d3d3;
            box-sizing: border-box;
            text-align: left;
        }

        .division-action-cell {
            padding: 8px 12px;
            vertical-align: middle;
            text-align: center;
            background-color: #d3d3d3;
        }

        .item-action-cell {
            padding: 10px 12px;
            vertical-align: middle;
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- LOGIN PAGE -->
    <div id="loginPage" class="login-container">
        <div class="login-box">
            <h1>BOQ Builder</h1>
            <p class="subtitle">Bill of Quantity Builder</p>
            
            <form id="loginForm" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="email">Email Address:</label>
                    <input type="text" id="email" name="email" placeholder="Enter your email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <div class="password-wrapper">
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                        <button type="button" class="password-toggle" onclick="togglePasswordVisibility()" id="passwordToggleBtn" title="Show/Hide Password">
                            👁️
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn-login" id="loginBtn">Sign In</button>
                
                <div class="loading-spinner" id="loginSpinner">
                    <div class="spinner"></div>
                </div>
                
                <div id="loginMessage" class="login-message"></div>
            </form>
        </div>
    </div>

    <!-- MAIN APP -->
    <div id="appPage" class="app-container">
        <div class="app-header">
            <h2>BOQ Builder</h2>
            <div class="app-header" style="background-color: transparent; padding: 0;">
                <div class="user-info">
                    <div>
                        <div class="user-name" id="displayUserName">User</div>
                        <div class="user-role" id="displayUserRole">Role</div>
                    </div>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </div>
            </div>
        </div>

        <div class="app-body">
            <!-- SIDEBAR -->
            <div class="sidebar">
                <h3>Menu</h3>
                <div class="sidebar-buttons">
                    <button class="btn-sidebar" onclick="createNewProject()">+ New</button>
                    <button class="btn-sidebar" onclick="toggleSavedProjects()">📂 Open</button>
                </div>

                <div id="savedProjectsContainer" style="display: none;">
                    <div class="saved-projects-label">Saved Projects</div>
                    <div id="savedProjectsList" class="saved-projects-list">
                        <div class="no-saved-projects">Loading...</div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTENT -->
            <div class="main-content">
                <div class="container">
                    <h1>Bill of Quantity (BOQ) Builder</h1>
                    
                    <div id="message" class="message"></div>
                    
                    <!-- Header Section -->
                    <div class="header-section">
                        <div class="header-row">
                            <div class="header-item">
                                <div class="header-label">PROJECT:</div>
                                <div class="header-input">
                                    <input type="text" id="project" placeholder="Enter project name">
                                </div>
                            </div>
                            <div class="header-item">
                                <div class="header-label">LOCATION/PROPERTY:</div>
                                <div class="header-input">
                                    <input type="text" id="location" placeholder="Enter location">
                                </div>
                            </div>
                        </div>
                        <div class="header-row">
                            <div class="header-item">
                                <div class="header-label">PREPARED BY:</div>
                                <div class="header-input">
                                    <input type="text" id="preparedBy" placeholder="Enter name" readonly>
                                </div>
                            </div>
                            <div class="header-item">
                                <div class="header-label">DATE CREATED:</div>
                                <div class="header-input">
                                    <input type="text" id="dateCreated" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- BOQ Table -->
                    <div class="table-section">
                        <table>
                            <thead>
                                <tr>
                                    <th class="col-item">ITEM</th>
                                    <th class="col-description">DESCRIPTION</th>
                                    <th class="col-qty">QTY</th>
                                    <th class="col-unit">UNIT</th>
                                    <th class="col-action">ACTION</th>
                                </tr>
                            </thead>
                            <tbody id="boqTable">
                                <!-- Rows will be generated by JavaScript -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="button-group">
                        <button class="btn-add" onclick="addDivision()">+ Add Division</button>
                        <button class="btn-save" onclick="saveBOQ()">💾 Save</button>
                        <button class="btn-export" onclick="exportToSheet()">Export to Google Sheet</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // ===== PASSWORD VISIBILITY TOGGLE =====
        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const toggleBtn = document.getElementById('passwordToggleBtn');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        }

        // ===== LOGIN SYSTEM =====
        let currentUser = null;
        let currentProjectId = null;
        let savedProjects = [];

        window.addEventListener('load', function() {
            checkLoginStatus();
        });

        function checkLoginStatus() {
            const sessionUser = sessionStorage.getItem('currentUser');
            if (sessionUser) {
                currentUser = JSON.parse(sessionUser);
                showApp();
            } else {
                showLogin();
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginBtn = document.getElementById('loginBtn');
            const spinner = document.getElementById('loginSpinner');
            const messageEl = document.getElementById('loginMessage');
            
            if (!email || !password) {
                showLoginMessage('Please enter both email and password', 'error');
                return;
            }

            loginBtn.disabled = true;
            spinner.style.display = 'block';
            messageEl.className = 'login-message';

            google.script.run.withSuccessHandler(function(result) {
                loginBtn.disabled = false;
                spinner.style.display = 'none';

                if (result.success) {
                    currentUser = result.user;
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showLoginMessage('Login successful! Redirecting...', 'success');
                    setTimeout(function() {
                        showApp();
                    }, 1000);
                } else {
                    showLoginMessage(result.message || 'Invalid email or password', 'error');
                }
            }).withFailureHandler(function(error) {
                loginBtn.disabled = false;
                spinner.style.display = 'none';
                showLoginMessage('Error: ' + error, 'error');
                console.error(error);
            }).verifyUser(email, password);
        }

        function showLoginMessage(text, type) {
            const messageEl = document.getElementById('loginMessage');
            messageEl.textContent = text;
            messageEl.className = 'login-message ' + type;
        }

        function showLogin() {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('appPage').style.display = 'none';
        }

        function showApp() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('appPage').style.display = 'flex';
            document.getElementById('displayUserName').textContent = currentUser.name;
            document.getElementById('displayUserRole').textContent = currentUser.role;
            document.getElementById('preparedBy').value = currentUser.name;
            setCurrentDate();
            loadTemplateSheetNames();
            createNewProject();
        }

        function handleLogout() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('currentUser');
                currentUser = null;
                document.getElementById('loginForm').reset();
                showLogin();
                document.getElementById('loginMessage').className = 'login-message';
            }
        }

        // ===== SIDEBAR FUNCTIONS =====
        function toggleSavedProjects() {
            const container = document.getElementById('savedProjectsContainer');
            const isShowing = container.style.display !== 'none';
            container.style.display = isShowing ? 'none' : 'block';
            if (!isShowing) {
                loadUserSavedProjects();
            }
        }

        function loadUserSavedProjects() {
            console.log('Loading projects for:', currentUser.email);
            google.script.run.withSuccessHandler(function(projects) {
                console.log('Projects received:', projects);
                savedProjects = projects || [];
                renderSavedProjectsList();
            }).withFailureHandler(function(error) {
                console.error('Error:', error);
                showMessage('Error loading saved projects: ' + error, 'error');
            }).getUserSavedProjects(currentUser.email);
        }

        function renderSavedProjectsList() {
            const listContainer = document.getElementById('savedProjectsList');
            listContainer.innerHTML = '';

            if (savedProjects.length === 0) {
                listContainer.innerHTML = '<div class="no-saved-projects">No saved projects yet</div>';
                return;
            }

            savedProjects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'saved-project-item' + (currentProjectId === project.id ? ' active' : '');
                projectItem.textContent = project.projectName || 'Untitled Project';
                projectItem.title = 'Click to load: ' + (project.projectName || 'Untitled');
                projectItem.onclick = () => loadProject(project.id);
                listContainer.appendChild(projectItem);
            });
        }

        function createNewProject() {
            currentProjectId = null;
            boqData = [];
            divisionCount = 0;
            itemCount = 0;
            templateData = {};
            document.getElementById('project').value = '';
            document.getElementById('location').value = '';
            setCurrentDate();
            
            if (boqData.length === 0) {
                addDivision();
            }
            renderTable();
            renderSavedProjectsList();
            showMessage('New project created', 'success');
        }

        function loadProject(projectId) {
            console.log('Loading project:', projectId);
            google.script.run.withSuccessHandler(function(result) {
                console.log('Load result:', result);
                if (result.success) {
                    currentProjectId = projectId;
                    boqData = result.data || [];
                    templateData = {};
                    document.getElementById('project').value = result.projectName || '';
                    document.getElementById('location').value = result.location || '';
                    document.getElementById('dateCreated').value = result.dateCreated || '';
                    
                    if (boqData.length > 0) {
                        divisionCount = boqData.length;
                        let maxItemId = 0;
                        boqData.forEach(division => {
                            division.items.forEach(item => {
                                const itemNum = parseInt(item.id.split('_')[1]);
                                if (itemNum > maxItemId) maxItemId = itemNum;
                            });
                        });
                        itemCount = maxItemId;
                    }
                    
                    renderTable();
                    renderSavedProjectsList();
                    showMessage('Project "' + result.projectName + '" loaded successfully', 'success');
                } else {
                    showMessage('Error: ' + (result.error || 'Project not found'), 'error');
                }
            }).withFailureHandler(function(error) {
                console.error('Load error:', error);
                showMessage('Error loading project: ' + error, 'error');
            }).loadUserProject(projectId, currentUser.email);
        }

        // ===== BOQ APP CODE =====
        let boqData = [];
        let divisionCount = 0;
        let itemCount = 0;
        let templateSheetNames = [];
        let templateData = {};

        function setCurrentDate() {
            const today = new Date();
            const dateStr = today.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            document.getElementById('dateCreated').value = dateStr;
        }

        function loadTemplateSheetNames() {
            google.script.run.withSuccessHandler(function(sheetNames) {
                templateSheetNames = sheetNames || [];
                if (templateSheetNames.length === 0) {
                    showMessage('No template divisions found', 'error');
                }
            }).withFailureHandler(function(error) {
                showMessage('Error loading templates: ' + error, 'error');
            }).getBOQTemplateSheetNames();
        }

        function getUsedDivisions(excludeDivisionId) {
            return boqData
                .filter(division => division.id !== excludeDivisionId && division.description !== 'NEW DIVISION')
                .map(division => division.description);
        }

        function onTemplateSelect(divisionId) {
            const selectElement = document.getElementById('templateSelect_' + divisionId);
            const selectedTemplate = selectElement.value;
            
            if (!selectedTemplate) {
                showMessage('Please select a template division', 'error');
                return;
            }

            const division = boqData.find(d => d.id === divisionId);
            if (!division) {
                showMessage('Division not found', 'error');
                return;
            }

            division.description = selectedTemplate;

            google.script.run.withSuccessHandler(function(result) {
                if (result.success) {
                    templateData[selectedTemplate] = result.items;
                    renderTable();
                    showMessage('Template "' + selectedTemplate + '" selected!', 'success');
                } else {
                    showMessage('Error: ' + result.error, 'error');
                    selectElement.value = '';
                }
            }).withFailureHandler(function(error) {
                showMessage('Error loading template: ' + error, 'error');
                selectElement.value = '';
            }).getBOQTemplateSection(selectedTemplate);
        }

        function addDivision() {
            if (boqData.length === 0) {
                divisionCount = 0;
                itemCount = 0;
            }

            divisionCount++;
            boqData.push({
                type: 'division',
                id: 'division_' + divisionCount,
                number: String(divisionCount).padStart(2, '0'),
                description: 'NEW DIVISION',
                items: []
            });
            renderTable();
            showMessage('Division ' + String(divisionCount).padStart(2, '0') + ' added', 'success');
        }

        function addRow(divisionId) {
            const division = boqData.find(d => d.id === divisionId);

            if (!division || division.type !== 'division') {
                showMessage('Invalid division', 'error');
                return;
            }

            itemCount++;
            const itemNumber = division.items.length + 1;
            division.items.push({
                type: 'item',
                id: 'item_' + itemCount,
                number: itemNumber,
                description: '',
                qty: '',
                unit: 'lot',
                isManual: false
            });
            renderTable();
        }

        function getUsedItemsInDivision(divisionId, excludeItemIndex) {
            const division = boqData.find(d => d.id === divisionId);
            if (!division) return [];

            return division.items
                .map((item, index) => {
                    if (index !== excludeItemIndex && item.description) {
                        return item.description;
                    }
                })
                .filter(desc => desc !== undefined);
        }

        function renderTable() {
            const tbody = document.getElementById('boqTable');
            tbody.innerHTML = '';

            if (boqData.length === 0) {
                const emptyRow = tbody.insertRow();
                const emptyCell = emptyRow.insertCell(0);
                emptyCell.colSpan = 5;
                emptyCell.className = 'empty-state';
                emptyCell.innerHTML = '<p>No divisions added yet. Click "+ Add Division" to get started.</p>';
                return;
            }

            boqData.forEach((division, divisionIndex) => {
                const usedDivisions = getUsedDivisions(division.id);
                const isGeneralRequirements = division.description === 'GENERAL REQUIREMENTS';

                const divisionRow = tbody.insertRow();
                divisionRow.className = 'division-header';

                const divisionCell = divisionRow.insertCell(0);
                divisionCell.textContent = division.number;
                divisionCell.style.fontWeight = 'bold';
                divisionCell.style.fontSize = '14px';
                divisionCell.className = 'col-item';

                const descriptionCell = divisionRow.insertCell(1);

                let descriptionHTML = \`<select id="templateSelect_\${division.id}" onchange="onTemplateSelect('\${division.id}')">
                    <option value="\${division.description}">\${division.description}</option>\`;

                templateSheetNames.forEach(sheetName => {
                    const isSelected = sheetName === division.description ? 'selected' : '';
                    const isUsed = usedDivisions.includes(sheetName);

                    if (!isUsed || isSelected) {
                        descriptionHTML += \`<option value="\${sheetName}" \${isSelected}>\${sheetName}</option>\`;
                    }
                });

                descriptionHTML += \`</select>\`;

                descriptionCell.innerHTML = descriptionHTML;
                descriptionCell.className = 'division-description-cell col-description';

                const qtyCell = divisionRow.insertCell(2);
                qtyCell.textContent = '';
                qtyCell.className = 'col-qty';

                const unitCell = divisionRow.insertCell(3);
                unitCell.textContent = '';
                unitCell.className = 'col-unit';

                const actionCell = divisionRow.insertCell(4);
                actionCell.className = 'division-action-cell col-action';
                actionCell.innerHTML = \`<button class="btn-remove" onclick="removeDivision('\${division.id}')">Remove</button>\`;

                division.items.forEach((item, itemIndex) => {
                    const itemRow = tbody.insertRow();
                    itemRow.className = 'item-row';

                    const numberCell = itemRow.insertCell(0);
                    numberCell.textContent = item.number;
                    numberCell.className = 'col-item';

                    const descCell = itemRow.insertCell(1);

                    let itemDescHTML = '';

                    if (item.isManual) {
                        itemDescHTML = \`<input type="text" value="\${item.description}" onchange="updateItem('\${division.id}', \${itemIndex}, 'description', this.value)" placeholder="Enter custom description">\`;
                    } else {
                        itemDescHTML = \`<select onchange="onItemSelect('\${division.id}', \${itemIndex}, this.value)">
                            <option value="">Select item...</option>\`;

                        if (templateData[division.description]) {
                            const usedItems = isGeneralRequirements ? getUsedItemsInDivision(division.id, itemIndex) : [];
                            
                            templateData[division.description].forEach(templateItem => {
                                const isUsed = isGeneralRequirements && usedItems.includes(templateItem.description);
                                const isSelected = templateItem.description === item.description ? 'selected' : '';

                                if (!isUsed || isSelected) {
                                    itemDescHTML += \`<option value="\${templateItem.description}" \${isSelected}>\${templateItem.description}</option>\`;
                                }
                            });
                        }

                        itemDescHTML += \`<option value="__OTHERS__">Others (Manual Input)</option>\`;
                        itemDescHTML += \`</select>\`;
                    }

                    descCell.innerHTML = itemDescHTML;
                    descCell.className = 'col-description';

                    const qtyCell = itemRow.insertCell(2);
                    if (isGeneralRequirements) {
                        qtyCell.innerHTML = \`<input type="number" value="1" disabled>\`;
                        item.qty = '1';
                    } else {
                        qtyCell.innerHTML = \`<input type="number" value="\${item.qty}" onchange="updateItem('\${division.id}', \${itemIndex}, 'qty', this.value)" placeholder="Qty">\`;
                    }
                    qtyCell.className = 'col-qty';

                    const unitCell = itemRow.insertCell(3);
                    const unitValue = item.unit || '';
                    unitCell.innerHTML = \`<input type="text" value="\${unitValue}" disabled>\`;
                    unitCell.className = 'col-unit';

                    const removeCell = itemRow.insertCell(4);
                    removeCell.className = 'item-action-cell col-action';
                    removeCell.innerHTML = \`<button class="btn-delete-item" onclick="removeItem('\${division.id}', \${itemIndex})">Remove</button>\`;
                });

                const actionRow = tbody.insertRow();
                actionRow.className = 'division-action-row';

                const actionCell1 = actionRow.insertCell(0);
                actionCell1.colSpan = 4;
                actionCell1.innerHTML = '';

                const actionCell2 = actionRow.insertCell(1);
                actionCell2.className = 'col-action';
                actionCell2.innerHTML = \`<button class="btn-add-row" onclick="addRow('\${division.id}')">+ Add Row</button>\`;
            });
        }

        function onItemSelect(divisionId, itemIndex, selectedValue) {
            const division = boqData.find(d => d.id === divisionId);
            if (!division || !division.items[itemIndex]) {
                return;
            }

            const item = division.items[itemIndex];
            const isGeneralRequirements = division.description === 'GENERAL REQUIREMENTS';

            if (selectedValue === '__OTHERS__') {
                item.isManual = true;
                item.description = '';
                if (isGeneralRequirements) {
                    item.qty = '1';
                    item.unit = 'lot';
                } else {
                    item.qty = '';
                    item.unit = '';
                }
                renderTable();
                return;
            }

            item.isManual = false;

            if (selectedValue && templateData[division.description]) {
                const templateItem = templateData[division.description].find(
                    t => t.description === selectedValue
                );

                if (templateItem) {
                    item.description = templateItem.description;
                    item.unit = templateItem.unit || '';
                    
                    if (isGeneralRequirements) {
                        item.qty = '1';
                    } else {
                        item.qty = templateItem.qty || '';
                    }
                }
            } else {
                item.description = selectedValue;
                item.unit = '';
                if (isGeneralRequirements) {
                    item.qty = '1';
                }
            }

            renderTable();
        }

        function updateItem(divisionId, itemIndex, field, value) {
            const division = boqData.find(d => d.id === divisionId);
            if (division && division.items[itemIndex]) {
                const isGeneralRequirements = division.description === 'GENERAL REQUIREMENTS';
                if ((isGeneralRequirements && field === 'qty') || field === 'unit') {
                    return;
                }
                division.items[itemIndex][field] = value;
            }
        }

        function removeItem(divisionId, itemIndex) {
            const division = boqData.find(d => d.id === divisionId);
            if (division) {
                division.items.splice(itemIndex, 1);

                division.items.forEach((item, index) => {
                    item.number = index + 1;
                });

                renderTable();
                showMessage('Item removed', 'success');
            }
        }

        function removeDivision(divisionId) {
            if (confirm('Are you sure you want to remove this division and all its items?')) {
                boqData = boqData.filter(d => d.id !== divisionId);

                if (boqData.length === 0) {
                    divisionCount = 0;
                    itemCount = 0;
                    showMessage('All divisions removed. Numbering reset.', 'success');
                } else {
                    boqData.forEach((division, index) => {
                        division.number = String(index + 1).padStart(2, '0');
                        division.id = 'division_' + (index + 1);
                    });
                    divisionCount = boqData.length;
                    showMessage('Division removed', 'success');
                }

                renderTable();
            }
        }

        function saveBOQ() {
            const projectName = document.getElementById('project').value.trim();
            
            if (!projectName) {
                showMessage('Please enter a project name before saving', 'error');
                return;
            }

            if (boqData.length === 0) {
                showMessage('Please add at least one division before saving', 'error');
                return;
            }

            const boqInfo = {
                projectId: currentProjectId,
                projectName: projectName,
                location: document.getElementById('location').value,
                preparedBy: document.getElementById('preparedBy').value,
                dateCreated: document.getElementById('dateCreated').value,
                data: boqData,
                userEmail: currentUser.email
            };

            google.script.run.withSuccessHandler(function(result) {
                if (result.success) {
                    currentProjectId = result.projectId;
                    showMessage('BOQ saved successfully!', 'success');
                    loadUserSavedProjects();
                } else {
                    showMessage('Error saving: ' + (result.error || 'Unknown error'), 'error');
                }
            }).withFailureHandler(function(error) {
                showMessage('Error saving BOQ: ' + error, 'error');
            }).saveUserBOQ(boqInfo);
        }

        function exportToSheet() {
            if (boqData.length === 0) {
                showMessage('Please add at least one division before exporting', 'error');
                return;
            }

            const boqInfo = {
                projectName: document.getElementById('project').value,
                location: document.getElementById('location').value,
                preparedBy: document.getElementById('preparedBy').value,
                dateCreated: document.getElementById('dateCreated').value,
                data: boqData
            };

            google.script.run.withSuccessHandler(function(result) {
                showMessage('BOQ exported to Google Sheet!', 'success');
                setTimeout(() => {
                    window.open(result, '_blank');
                }, 1500);
            }).withFailureHandler(function(error) {
                showMessage('Error exporting: ' + error, 'error');
            }).exportBOQToGoogleSheet(boqInfo);
        }

        function showMessage(text, type) {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = 'message ' + type;
            setTimeout(() => {
                messageEl.className = 'message';
            }, 4000);
        }
    </script>
</body>
</html>\`;
}

// ===== USER AUTHENTICATION =====
const USERS_SPREADSHEET_ID = '1pccR9rbBAzYItB-4I8NCsI0Zl0UZ0jbJWF9YJHk4Wlk';
const USERS_SHEET_NAME = 'Users';
const BOQ_STORAGE_PROPERTY = 'BOQ_DATA_';

function verifyUser(email, password) {
  try {
    const userSheet = SpreadsheetApp.openById(USERS_SPREADSHEET_ID).getSheetByName(USERS_SHEET_NAME);
    const data = userSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowEmail = row[0] ? String(row[0]).trim().toLowerCase() : '';
      const rowPassword = row[1] ? String(row[1]).trim() : '';
      const rowName = row[2] ? String(row[2]).trim() : '';
      const rowRole = row[3] ? String(row[3]).trim() : '';
      
      if (rowEmail === email.toLowerCase() && rowPassword === password) {
        return {
          success: true,
          user: {
            email: email,
            name: rowName,
            role: rowRole
          },
          message: 'Login successful'
        };
      }
    }
    
    return {
      success: false,
      message: 'Invalid email or password'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error verifying user: ' + error.toString()
    };
  }
}

// ===== BOQ TEMPLATE FUNCTIONS =====
const BOQ_TEMPLATE_SPREADSHEET_ID = '1pccR9rbBAzYItB-4I8NCsI0Zl0UZ0jbJWF9YJHk4Wlk';

function getBOQTemplateSheetNames() {
  try {
    const spreadsheet = SpreadsheetApp.openById(BOQ_TEMPLATE_SPREADSHEET_ID);
    const sheets = spreadsheet.getSheets();
    const sheetNames = [];
    
    sheets.forEach(sheet => {
      const name = sheet.getName();
      if (name !== USERS_SHEET_NAME && name !== 'UserBOQData') {
        sheetNames.push(name);
      }
    });
    
    return sheetNames;
  } catch (error) {
    Logger.log('Error getting BOQ template sheet names: ' + error);
    return [];
  }
}

function getBOQTemplateSection(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(BOQ_TEMPLATE_SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Sheet not found: ' + sheetName
      };
    }
    
    const dataRange = sheet.getDataRange();
    const data = dataRange.getValues();
    const items = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const description = row[0] ? String(row[0]).trim() : '';
      
      if (description) {
        items.push({
          item: String(i),
          description: description,
          qty: row[1] ? row[1] : '',
          unit: row[2] ? String(row[2]).trim() : ''
        });
      }
    }
    
    return {
      success: true,
      items: items
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error loading template: ' + error.toString()
    };
  }
}

// ===== BOQ SAVE/EXPORT FUNCTIONS USING PROPERTIES =====

/**
 * Save user BOQ data using Script Properties
 */
function saveUserBOQ(boqInfo) {
  try {
    const properties = PropertiesService.getUserProperties();
    const projectId = boqInfo.projectId || Utilities.getUuid();
    
    // Save BOQ data
    const boqKey = BOQ_STORAGE_PROPERTY + projectId;
    const boqData = {
      projectId: projectId,
      projectName: boqInfo.projectName,
      location: boqInfo.location,
      dateCreated: boqInfo.dateCreated,
      preparedBy: boqInfo.preparedBy,
      data: boqInfo.data,
      userEmail: boqInfo.userEmail,
      lastSaved: new Date().toISOString()
    };
    
    properties.setProperty(boqKey, JSON.stringify(boqData));
    
    // Update projects list
    const projectsKey = 'BOQ_PROJECTS_' + boqInfo.userEmail;
    const projectsList = properties.getProperty(projectsKey);
    let projects = projectsList ? JSON.parse(projectsList) : [];
    
    // Check if project already exists in list
    const existingIndex = projects.findIndex(p => p.id === projectId);
    if (existingIndex >= 0) {
      projects[existingIndex].projectName = boqInfo.projectName;
      projects[existingIndex].lastSaved = new Date().toISOString();
    } else {
      projects.push({
        id: projectId,
        projectName: boqInfo.projectName
      });
    }
    
    properties.setProperty(projectsKey, JSON.stringify(projects));
    
    Logger.log('BOQ saved - Project ID: ' + projectId);
    
    return {
      success: true,
      projectId: projectId
    };
  } catch (error) {
    Logger.log('Error saving user BOQ: ' + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get user's saved projects
 */
function getUserSavedProjects(userEmail) {
  try {
    const properties = PropertiesService.getUserProperties();
    const projectsKey = 'BOQ_PROJECTS_' + userEmail;
    const projectsList = properties.getProperty(projectsKey);
    const projects = projectsList ? JSON.parse(projectsList) : [];
    
    Logger.log('Found ' + projects.length + ' projects for ' + userEmail);
    return projects;
  } catch (error) {
    Logger.log('Error getting user saved projects: ' + error);
    return [];
  }
}

/**
 * Load user project
 */
function loadUserProject(projectId, userEmail) {
  try {
    const properties = PropertiesService.getUserProperties();
    const boqKey = BOQ_STORAGE_PROPERTY + projectId;
    const boqDataStr = properties.getProperty(boqKey);
    
    if (!boqDataStr) {
      return {
        success: false,
        error: 'Project not found'
      };
    }
    
    const boqData = JSON.parse(boqDataStr);
    
    // Verify user owns this project
    if (String(boqData.userEmail).toLowerCase() !== String(userEmail).toLowerCase()) {
      return {
        success: false,
        error: 'Access denied'
      };
    }
    
    return {
      success: true,
      projectName: boqData.projectName,
      location: boqData.location,
      dateCreated: boqData.dateCreated,
      data: boqData.data
    };
  } catch (error) {
    Logger.log('Error loading user project: ' + error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function exportBOQToGoogleSheet(boqInfo) {
  try {
    const exportSheet = SpreadsheetApp.create('BOQ_Export_' + new Date().getTime());
    const sheet = exportSheet.getActiveSheet();
    
    sheet.getRange('A1').setValue('PROJECT: ' + boqInfo.projectName);
    sheet.getRange('A2').setValue('LOCATION: ' + boqInfo.location);
    sheet.getRange('A3').setValue('PREPARED BY: ' + boqInfo.preparedBy);
    sheet.getRange('A4').setValue('DATE: ' + boqInfo.dateCreated);
    
    sheet.getRange('A6:E6').setValues([['DIVISION', 'ITEM', 'DESCRIPTION', 'QTY', 'UNIT']]);
    sheet.getRange('A6:E6').setFontWeight('bold').setBackground('#4a90e2').setFontColor('white');
    
    let row = 7;
    boqInfo.data.forEach(division => {
      division.items.forEach(item => {
        sheet.getRange(row, 1).setValue(division.description);
        sheet.getRange(row, 2).setValue(item.number);
        sheet.getRange(row, 3).setValue(item.description);
        sheet.getRange(row, 4).setValue(item.qty);
        sheet.getRange(row, 5).setValue(item.unit);
        row++;
      });
    });
    
    sheet.autoResizeColumns(1, 5);
    
    return exportSheet.getUrl();
  } catch (error) {
    Logger.log('Error exporting BOQ: ' + error);
    throw error;
  }
}
