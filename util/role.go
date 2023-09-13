package util

const (
	User  = 0
	Admin = 1
)

// IsSupportedRole returns true if the role is supported
func IsSupportedRole(currency int32) bool {
	switch currency {
	case User, Admin:
		return true
	}
	return false
}
