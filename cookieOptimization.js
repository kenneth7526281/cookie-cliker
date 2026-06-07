/**
 * Cookie Clicker - Cookie Count Optimization
 * Prevents lag when cookies reach extremely large numbers
 * Optimizes rendering, display formatting, and number handling
 */

// ============================================================================
// EFFICIENT NUMBER FORMATTING FOR LARGE COOKIE COUNTS
// ============================================================================

const CookieOptimizer = {
	// Cache for formatted numbers to avoid recalculation
	numberCache: {},
	cacheSize: 0,
	maxCacheSize: 1000,
	
	/**
	 * Format large numbers efficiently without causing lag
	 * Converts numbers to scientific notation for extreme values
	 */
	formatLargeNumber: function(num) {
		if (typeof num !== 'number' || isNaN(num)) return '0';
		
		// Check cache first
		const cacheKey = Math.floor(num / 1000) + '';
		if (this.numberCache[cacheKey]) {
			return this.numberCache[cacheKey];
		}
		
		let formatted = '';
		
		if (num < 1000) {
			formatted = Math.floor(num).toString();
		} else if (num < 1000000) {
			formatted = (Math.floor(num / 1000) * 1000).toLocaleString();
		} else if (num < 1000000000) {
			const millions = num / 1000000;
			formatted = millions.toFixed(millions < 10 ? 2 : millions < 100 ? 1 : 0) + 'M';
		} else if (num < 1000000000000) {
			const billions = num / 1000000000;
			formatted = billions.toFixed(billions < 10 ? 2 : billions < 100 ? 1 : 0) + 'B';
		} else if (num < 1000000000000000) {
			const trillions = num / 1000000000000;
			formatted = trillions.toFixed(trillions < 10 ? 2 : trillions < 100 ? 1 : 0) + 'T';
		} else {
			// For extremely large numbers, use scientific notation
			formatted = num.toExponential(2);
		}
		
		// Store in cache (with size limit)
		if (this.cacheSize < this.maxCacheSize) {
			this.numberCache[cacheKey] = formatted;
			this.cacheSize++;
		}
		
		return formatted;
	},
	
	/**
	 * Clear the number formatting cache when needed
	 */
	clearCache: function() {
		this.numberCache = {};
		this.cacheSize = 0;
	},
	
	// ========================================================================
	// RENDERING OPTIMIZATION
	// ========================================================================
	
	/**
	 * Batch DOM updates to prevent excessive reflows
	 * Use requestAnimationFrame for smooth updates
	 */
	pendingUpdates: [],
	updateScheduled: false,
	
	scheduleDOMUpdate: function(element, updateFunc) {
		this.pendingUpdates.push({ element, updateFunc });
		
		if (!this.updateScheduled) {
			this.updateScheduled = true;
			requestAnimationFrame(() => {
				this.processPendingUpdates();
			});
		}
	},
	
	processPendingUpdates: function() {
		// Batch all DOM updates together
		const documentFragment = document.createDocumentFragment();
		
		for (const update of this.pendingUpdates) {
			update.updateFunc(update.element);
		}
		
		this.pendingUpdates = [];
		this.updateScheduled = false;
	},
	
	// ========================================================================
	// OPTIMIZE COOKIE DISPLAY WITH FIXED PRECISION
	// ========================================================================
	
	/**
	 * Update cookie count display without recalculating every frame
	 * Throttle updates to every 100ms when numbers are stable
	 */
	lastDisplayValue: 0,
	displayUpdateThreshold: 1,
	lastDisplayUpdateTime: 0,
	displayUpdateInterval: 100, // milliseconds
	
	updateCookieDisplay: function(cookieCount, displayElement) {
		const now = Date.now();
		
		// Only update display if significant time has passed or value changed significantly
		if (now - this.lastDisplayUpdateTime < this.displayUpdateInterval &&
			Math.abs(cookieCount - this.lastDisplayValue) < this.displayUpdateThreshold) {
			return;
		}
		
		this.lastDisplayValue = cookieCount;
		this.lastDisplayUpdateTime = now;
		
		const formatted = this.formatLargeNumber(cookieCount);
		if (displayElement && displayElement.textContent !== formatted) {
			displayElement.textContent = formatted;
		}
	},
	
	// ========================================================================
	// PREVENT MASSIVE STRING OPERATIONS
	// ========================================================================
	
	/**
	 * Limit calculation frequency for cookie production stats
	 * Prevents recalculating CpS every single frame
	 */
	lastCpsCalculation: 0,
	cpsCalculationInterval: 500, // milliseconds
	cachedCps: 0,
	
	getOptimizedCps: function(game) {
		const now = Date.now();
		
		if (now - this.lastCpsCalculation >= this.cpsCalculationInterval) {
			this.lastCpsCalculation = now;
			// This would call game's actual CPS calculation
			// this.cachedCps = game.getCookiesPerSecond();
		}
		
		return this.cachedCps;
	},
	
	// ========================================================================
	// GARBAGE COLLECTION HELPER
	// ========================================================================
	
	/**
	 * Periodically clean up unused data structures
	 */
	cleanupInterval: null,
	
	startCleanup: function() {
		if (this.cleanupInterval) return;
		
		this.cleanupInterval = setInterval(() => {
			// Clear cache periodically
			if (this.cacheSize > this.maxCacheSize * 0.8) {
				this.clearCache();
			}
		}, 30000); // Every 30 seconds
	},
	
	stopCleanup: function() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
		}
	},
	
	// ========================================================================
	// INITIALIZE OPTIMIZATION
	// ========================================================================
	
	init: function() {
		console.log('🍪 Cookie Optimizer initialized - Large number handling enabled!');
		this.startCleanup();
	},
	
	destroy: function() {
		this.stopCleanup();
		this.clearCache();
		this.pendingUpdates = [];
		console.log('🍪 Cookie Optimizer destroyed');
	}
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => CookieOptimizer.init());
} else {
	CookieOptimizer.init();
}

// ============================================================================
// EXPORT FOR USE IN MAIN.JS
// ============================================================================
// In main.js, replace large number displays with:
// CookieOptimizer.formatLargeNumber(Game.cookies)
// CookieOptimizer.updateCookieDisplay(Game.cookies, displayElement)
