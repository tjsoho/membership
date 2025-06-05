"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductId = exports.createMockProduct = exports.MockStripeProduct = void 0;
var MockStripeProduct = /** @class */ (function () {
    function MockStripeProduct(data) {
        var _a, _b, _c;
        this.object = "product";
        this.id = data.id || "prod_".concat(Math.random().toString(36).substr(2, 9));
        this.active = (_a = data.active) !== null && _a !== void 0 ? _a : true;
        this.created = data.created || Math.floor(Date.now() / 1000);
        this.default_price = data.default_price || null;
        this.description = data.description || null;
        this.images = data.images || [];
        this.livemode = (_b = data.livemode) !== null && _b !== void 0 ? _b : false;
        this.metadata = data.metadata || {};
        this.name = data.name || "Default Product Name";
        this.package_dimensions = null;
        this.shippable = (_c = data.shippable) !== null && _c !== void 0 ? _c : null;
        this.statement_descriptor = data.statement_descriptor || null;
        this.tax_code = data.tax_code || null;
        this.unit_label = data.unit_label || null;
        this.updated = data.updated || Math.floor(Date.now() / 1000);
        this.url = data.url || null;
    }
    // Mock methods that simulate Stripe API behavior
    MockStripeProduct.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new MockStripeProduct(data)];
            });
        });
    };
    MockStripeProduct.retrieve = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new MockStripeProduct({ id: id })];
            });
        });
    };
    MockStripeProduct.prototype.update = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                Object.assign(this, data);
                this.updated = Math.floor(Date.now() / 1000);
                return [2 /*return*/, this];
            });
        });
    };
    MockStripeProduct.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        deleted: true,
                        id: this.id,
                    }];
            });
        });
    };
    return MockStripeProduct;
}());
exports.MockStripeProduct = MockStripeProduct;
// Example usage:
var createMockProduct = function () { return __awaiter(void 0, void 0, void 0, function () {
    var product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, MockStripeProduct.create({
                    name: "Premium Membership",
                    description: "Access to premium features",
                    metadata: {
                        category: "membership",
                        tier: "premium",
                    },
                })];
            case 1:
                product = _a.sent();
                return [2 /*return*/, product];
        }
    });
}); };
exports.createMockProduct = createMockProduct;
// Example of getting a product ID
var getProductId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createMockProduct()];
            case 1:
                product = _a.sent();
                console.log("Product ID:", product.id); // This will show a randomly generated ID like 'prod_abc123xyz'
                return [2 /*return*/, product.id];
        }
    });
}); };
exports.getProductId = getProductId;
