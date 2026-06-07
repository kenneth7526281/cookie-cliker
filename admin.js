// Admin Panel for Cookie Clicker
// Password: kennethking

(function() {
    // Create admin button
    const adminBtn = document.createElement('button');
    adminBtn.id = 'adminPanelBtn';
    adminBtn.innerHTML = '⚙️ Admin';
    adminBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 8px 12px;
        background: #c30;
        color: #fff;
        border: 2px solid #f64;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0px 0px 12px rgba(255, 100, 68, 0.6);
        transition: all 0.2s;
    `;
    
    adminBtn.onmouseover = function() {
        this.style.background = '#f64';
        this.style.boxShadow = '0px 0px 20px rgba(255, 100, 68, 0.9)';
    };
    
    adminBtn.onmouseout = function() {
        this.style.background = '#c30';
        this.style.boxShadow = '0px 0px 12px rgba(255, 100, 68, 0.6)';
    };
    
    // Create admin modal
    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        justify-content: center;
        align-items: center;
    `;
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #1a1a1a;
        border: 3px solid #c30;
        border-radius: 8px;
        padding: 30px;
        max-width: 400px;
        box-shadow: 0 0 30px rgba(255, 100, 68, 0.5);
        color: #fff;
        font-family: Arial, sans-serif;
    `;
    
    let isUnlocked = false;
    
    // Password prompt
    const passwordHTML = `
        <h2 style="text-align: center; color: #f64; margin-top: 0;">🔐 Admin Panel</h2>
        <p style="text-align: center; font-size: 14px;">Enter password to unlock admin controls</p>
        <input type="password" id="adminPassword" placeholder="Enter password" 
            style="width: 100%; padding: 10px; margin: 15px 0; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; box-sizing: border-box;">
        <button id="unlockBtn" style="width: 100%; padding: 10px; background: #c30; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Unlock</button>
        <button id="closeModalBtn" style="width: 100%; padding: 10px; background: #666; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Close</button>
    `;
    
    const controlsHTML = `
        <h2 style="text-align: center; color: #f64; margin-top: 0;">⚙️ Admin Controls</h2>
        <div style="background: #222; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <label style="display: block; margin-bottom: 10px; font-weight: bold;">💰 Add Cookies</label>
            <input type="number" id="cookieAmount" placeholder="Enter amount" value="1000000" 
                style="width: 100%; padding: 8px; margin-bottom: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; box-sizing: border-box;">
            <button id="addCookiesBtn" style="width: 100%; padding: 8px; background: #058; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Add Cookies</button>
        </div>
        
        <div style="background: #222; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <label style="display: block; margin-bottom: 10px; font-weight: bold;">🗑️ Remove Cookies</label>
            <input type="number" id="removeCookieAmount" placeholder="Enter amount" value="100000" 
                style="width: 100%; padding: 8px; margin-bottom: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; box-sizing: border-box;">
            <button id="removeCookiesBtn" style="width: 100%; padding: 8px; background: #c30; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Remove Cookies</button>
        </div>
        
        <div style="background: #222; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <label style="display: block; margin-bottom: 10px; font-weight: bold;">⭐ Add Prestige Level</label>
            <input type="number" id="prestigeAmount" placeholder="Enter amount" value="10" 
                style="width: 100%; padding: 8px; margin-bottom: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; box-sizing: border-box;">
            <button id="addPrestigeBtn" style="width: 100%; padding: 8px; background: #96f; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Add Prestige</button>
        </div>
        
        <div style="background: #222; padding: 15px; border-radius: 4px; margin: 15px 0;">
            <label style="display: block; margin-bottom: 10px; font-weight: bold;">✨ Add Heavenly Chips</label>
            <input type="number" id="heavenlyAmount" placeholder="Enter amount" value="5" 
                style="width: 100%; padding: 8px; margin-bottom: 10px; background: #333; color: #fff; border: 1px solid #666; border-radius: 4px; box-sizing: border-box;">
            <button id="addHeavenlyBtn" style="width: 100%; padding: 8px; background: #fc0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Add Heavenly Chips</button>
        </div>
        
        <div style="background: #2a2a2a; padding: 10px; border-radius: 4px; text-align: center; margin-top: 15px; font-size: 12px;">
            <p id="statusMsg" style="margin: 0; color: #6f6;">Ready</p>
        </div>
        
        <button id="lockBtn" style="width: 100%; padding: 10px; background: #666; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">Lock Admin Panel</button>
    `;
    
    // Set initial content (password prompt)
    modalContent.innerHTML = passwordHTML;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.appendChild(adminBtn);
    
    // Helper function to show status message
    function showStatus(message, color = '#6f6') {
        const statusMsg = document.getElementById('statusMsg');
        if (statusMsg) {
            statusMsg.textContent = message;
            statusMsg.style.color = color;
            setTimeout(() => {
                statusMsg.textContent = 'Ready';
                statusMsg.style.color = '#6f6';
            }, 3000);
        }
    }
    
    // Admin button click
    adminBtn.addEventListener('click', function() {
        if (isUnlocked) {
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'flex';
        }
    });
    
    // Handle password unlock
    document.addEventListener('click', function(e) {
        if (e.target.id === 'unlockBtn') {
            const password = document.getElementById('adminPassword').value;
            if (password === 'kennethking') {
                isUnlocked = true;
                modalContent.innerHTML = controlsHTML;
                attachControlListeners();
                showStatus('✅ Unlocked!', '#6f6');
            } else {
                showStatus('❌ Wrong password!', '#f66');
                document.getElementById('adminPassword').value = '';
            }
        }
        
        if (e.target.id === 'closeModalBtn') {
            modal.style.display = 'none';
        }
        
        if (e.target.id === 'lockBtn') {
            isUnlocked = false;
            modalContent.innerHTML = passwordHTML;
            modal.style.display = 'none';
        }
    });
    
    // Attach control event listeners
    function attachControlListeners() {
        const addCookiesBtn = document.getElementById('addCookiesBtn');
        const removeCookiesBtn = document.getElementById('removeCookiesBtn');
        const addPrestigeBtn = document.getElementById('addPrestigeBtn');
        const addHeavenlyBtn = document.getElementById('addHeavenlyBtn');
        
        if (addCookiesBtn) {
            addCookiesBtn.addEventListener('click', function() {
                const amount = parseFloat(document.getElementById('cookieAmount').value) || 0;
                if (window.Game && window.Game.cookies !== undefined) {
                    window.Game.cookies += amount;
                    window.Game.cookiesEarned += amount;
                    showStatus(`➕ Added ${amount.toLocaleString()} cookies!`);
                    if (window.Game.UpgradeDisplay) window.Game.UpgradeDisplay();
                } else {
                    showStatus('Game not loaded yet', '#f66');
                }
            });
        }
        
        if (removeCookiesBtn) {
            removeCookiesBtn.addEventListener('click', function() {
                const amount = parseFloat(document.getElementById('removeCookieAmount').value) || 0;
                if (window.Game && window.Game.cookies !== undefined) {
                    window.Game.cookies = Math.max(0, window.Game.cookies - amount);
                    showStatus(`➖ Removed ${amount.toLocaleString()} cookies!`);
                    if (window.Game.UpgradeDisplay) window.Game.UpgradeDisplay();
                } else {
                    showStatus('Game not loaded yet', '#f66');
                }
            });
        }
        
        if (addPrestigeBtn) {
            addPrestigeBtn.addEventListener('click', function() {
                const amount = parseInt(document.getElementById('prestigeAmount').value) || 0;
                if (window.Game && window.Game.prestige !== undefined) {
                    window.Game.prestige += amount;
                    showStatus(`⭐ Added ${amount} prestige levels!`);
                } else {
                    showStatus('Game not loaded yet', '#f66');
                }
            });
        }
        
        if (addHeavenlyBtn) {
            addHeavenlyBtn.addEventListener('click', function() {
                const amount = parseInt(document.getElementById('heavenlyAmount').value) || 0;
                if (window.Game) {
                    // Add heavenly chips (heavenchips or similar property)
                    if (window.Game.heavenchips !== undefined) {
                        window.Game.heavenchips += amount;
                    } else if (window.Game.ascendCounter !== undefined) {
                        window.Game.ascendCounter += amount;
                    }
                    showStatus(`✨ Added ${amount} heavenly chips!`);
                } else {
                    showStatus('Game not loaded yet', '#f66');
                }
            });
        }
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
})();
