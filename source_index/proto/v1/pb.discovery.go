// Code generated by cproto. DO NOT EDIT.

package sourceindexpb

import "go.chromium.org/luci/grpc/discovery"

import "google.golang.org/protobuf/types/descriptorpb"

func init() {
	discovery.RegisterDescriptorSetCompressed(
		[]string{
			"luci.source_index.v1.SourceIndex",
		},
		[]byte{31, 139,
			8, 0, 0, 0, 0, 0, 0, 255, 140, 86, 79, 115, 219, 186,
			17, 23, 69, 217, 149, 145, 52, 201, 67, 234, 196, 85, 91, 191,
			141, 39, 51, 177, 103, 36, 202, 118, 234, 190, 78, 222, 180, 51,
			142, 243, 79, 109, 42, 165, 146, 221, 52, 189, 196, 16, 185, 20,
			209, 144, 0, 3, 128, 146, 117, 232, 247, 232, 7, 232, 76, 239,
			157, 246, 208, 123, 239, 253, 74, 111, 0, 146, 254, 23, 31, 162,
			19, 118, 177, 192, 254, 118, 127, 191, 37, 68, 254, 125, 159, 252,
			102, 38, 131, 48, 81, 50, 227, 69, 22, 72, 53, 235, 167, 69,
			200, 251, 90, 22, 42, 196, 143, 92, 68, 120, 214, 207, 149, 52,
			178, 63, 223, 187, 226, 13, 156, 151, 254, 196, 134, 7, 87, 54,
			230, 123, 91, 127, 247, 200, 131, 63, 22, 168, 150, 71, 50, 203,
			184, 121, 195, 116, 50, 198, 207, 5, 106, 67, 41, 105, 37, 82,
			155, 13, 15, 188, 237, 181, 177, 91, 211, 77, 66, 20, 230, 82,
			115, 35, 213, 114, 163, 233, 118, 46, 121, 232, 35, 114, 219, 173,
			185, 20, 31, 21, 198, 27, 190, 139, 184, 85, 251, 198, 24, 211,
			39, 228, 238, 121, 136, 40, 178, 41, 170, 141, 22, 120, 219, 254,
			248, 78, 237, 30, 58, 239, 86, 143, 60, 252, 2, 153, 206, 165,
			208, 232, 160, 49, 157, 156, 67, 99, 58, 217, 255, 27, 185, 53,
			113, 197, 13, 108, 109, 84, 144, 187, 215, 78, 211, 110, 112, 83,
			11, 130, 155, 203, 239, 244, 190, 50, 186, 132, 244, 252, 217, 95,
			126, 253, 245, 252, 124, 95, 122, 157, 51, 159, 254, 238, 255, 119,
			201, 42, 109, 221, 105, 252, 202, 35, 255, 107, 17, 239, 54, 245,
			239, 52, 232, 254, 127, 91, 112, 36, 243, 165, 226, 179, 196, 192,
			254, 238, 254, 47, 225, 56, 65, 120, 123, 114, 52, 128, 195, 194,
			36, 82, 233, 128, 16, 120, 203, 67, 20, 26, 35, 40, 68, 132,
			10, 76, 130, 112, 152, 179, 208, 70, 150, 59, 93, 248, 19, 42,
			205, 165, 128, 253, 96, 23, 182, 109, 192, 86, 181, 181, 181, 243,
			61, 129, 165, 44, 32, 99, 75, 16, 210, 64, 161, 17, 76, 194,
			53, 196, 60, 69, 192, 179, 16, 115, 3, 92, 64, 40, 179, 60,
			229, 76, 132, 8, 11, 110, 18, 151, 165, 186, 35, 32, 240, 161,
			186, 65, 78, 13, 227, 2, 24, 132, 50, 95, 130, 140, 47, 135,
			1, 51, 132, 128, 251, 37, 198, 228, 207, 250, 253, 197, 98, 17,
			48, 135, 180, 108, 86, 25, 167, 251, 111, 7, 71, 47, 135, 147,
			151, 189, 253, 96, 151, 16, 56, 17, 41, 106, 13, 10, 63, 23,
			92, 97, 4, 211, 37, 176, 60, 79, 121, 200, 166, 41, 66, 202,
			22, 32, 21, 176, 153, 66, 140, 192, 72, 139, 117, 161, 184, 225,
			98, 214, 5, 45, 99, 179, 96, 10, 9, 68, 92, 27, 197, 167,
			133, 185, 210, 166, 26, 25, 215, 87, 2, 164, 0, 38, 96, 235,
			112, 2, 131, 201, 22, 60, 63, 156, 12, 38, 93, 2, 239, 7,
			199, 111, 70, 39, 199, 240, 254, 112, 60, 62, 28, 30, 15, 94,
			78, 96, 52, 134, 163, 209, 240, 197, 224, 120, 48, 26, 78, 96,
			244, 10, 14, 135, 31, 224, 247, 131, 225, 139, 46, 32, 55, 9,
			42, 192, 179, 92, 89, 244, 82, 1, 183, 13, 196, 40, 32, 48,
			65, 188, 146, 62, 150, 37, 28, 157, 99, 200, 99, 30, 66, 202,
			196, 172, 96, 51, 132, 153, 156, 163, 18, 92, 204, 32, 71, 149,
			113, 109, 73, 212, 192, 68, 68, 32, 229, 25, 55, 204, 56, 199,
			23, 21, 5, 132, 180, 137, 215, 164, 254, 189, 198, 47, 236, 170,
			77, 125, 218, 24, 145, 53, 210, 108, 223, 42, 151, 71, 164, 185,
			218, 160, 173, 245, 198, 183, 94, 231, 59, 120, 167, 228, 156, 71,
			168, 33, 67, 147, 200, 72, 219, 70, 42, 52, 138, 227, 28, 173,
			143, 69, 204, 48, 203, 231, 140, 27, 43, 133, 140, 27, 43, 61,
			66, 252, 213, 134, 71, 253, 245, 246, 125, 242, 31, 159, 180, 86,
			27, 205, 6, 245, 55, 155, 239, 58, 255, 244, 225, 218, 152, 216,
			251, 10, 37, 116, 117, 28, 76, 194, 12, 100, 204, 132, 9, 106,
			136, 80, 59, 110, 235, 249, 183, 169, 202, 184, 46, 129, 41, 211,
			37, 41, 55, 143, 41, 228, 76, 177, 12, 13, 42, 29, 64, 185,
			123, 113, 15, 215, 231, 199, 137, 5, 223, 139, 165, 52, 168, 220,
			82, 207, 69, 143, 71, 150, 154, 35, 213, 43, 15, 246, 222, 85,
			7, 237, 92, 141, 43, 192, 167, 195, 209, 241, 199, 87, 163, 147,
			225, 139, 83, 224, 165, 164, 171, 26, 184, 118, 51, 227, 134, 184,
			84, 102, 57, 213, 189, 242, 91, 65, 224, 125, 130, 194, 30, 80,
			8, 76, 33, 100, 69, 106, 120, 158, 226, 121, 221, 219, 60, 192,
			160, 228, 158, 101, 231, 215, 94, 116, 33, 12, 11, 165, 29, 246,
			136, 199, 49, 42, 20, 231, 237, 7, 45, 51, 76, 228, 98, 167,
			235, 206, 199, 92, 233, 170, 159, 176, 29, 217, 110, 100, 92, 96,
			4, 76, 77, 185, 81, 76, 241, 116, 185, 3, 11, 158, 166, 4,
			166, 88, 113, 97, 197, 72, 110, 147, 21, 75, 155, 71, 253, 205,
			213, 245, 218, 106, 82, 127, 243, 65, 183, 182, 124, 234, 111, 126,
			55, 36, 132, 52, 91, 13, 218, 122, 212, 216, 243, 44, 243, 45,
			123, 230, 81, 123, 147, 156, 145, 86, 203, 17, 255, 184, 73, 59,
			159, 96, 92, 13, 106, 224, 62, 86, 51, 110, 120, 138, 26, 236,
			219, 17, 192, 31, 10, 109, 108, 126, 6, 186, 152, 70, 50, 179,
			31, 11, 25, 195, 105, 48, 147, 114, 150, 98, 217, 189, 32, 148,
			217, 41, 129, 109, 12, 102, 1, 156, 127, 78, 175, 71, 236, 148,
			216, 109, 230, 21, 155, 186, 93, 91, 30, 245, 31, 175, 253, 184,
			182, 124, 234, 63, 190, 247, 13, 57, 118, 24, 61, 234, 63, 105,
			110, 116, 94, 95, 195, 248, 218, 246, 92, 201, 191, 98, 104, 172,
			240, 63, 91, 153, 93, 161, 89, 92, 3, 211, 215, 42, 188, 200,
			239, 173, 216, 107, 235, 252, 158, 77, 178, 118, 191, 182, 124, 234,
			63, 121, 240, 144, 252, 203, 115, 0, 154, 212, 239, 54, 59, 157,
			127, 120, 215, 16, 8, 203, 190, 140, 47, 152, 143, 48, 118, 244,
			113, 1, 115, 150, 22, 88, 205, 222, 151, 242, 37, 55, 235, 183,
			2, 172, 48, 214, 253, 4, 89, 164, 251, 25, 211, 6, 85, 151,
			128, 158, 139, 103, 253, 190, 158, 139, 171, 79, 149, 51, 176, 111,
			84, 33, 62, 185, 250, 234, 242, 154, 43, 22, 116, 93, 158, 237,
			97, 119, 109, 189, 182, 124, 234, 119, 55, 126, 74, 208, 85, 231,
			83, 127, 183, 249, 243, 206, 159, 175, 21, 167, 237, 156, 10, 195,
			89, 10, 60, 178, 139, 152, 163, 170, 31, 135, 139, 22, 27, 167,
			150, 57, 10, 152, 42, 38, 194, 132, 192, 246, 229, 63, 18, 23,
			253, 246, 87, 108, 158, 31, 213, 150, 71, 253, 221, 246, 195, 218,
			178, 24, 58, 63, 115, 90, 245, 104, 235, 169, 125, 80, 173, 86,
			45, 43, 79, 219, 223, 146, 223, 146, 86, 203, 179, 90, 61, 104,
			210, 206, 158, 131, 23, 23, 105, 122, 233, 187, 6, 246, 175, 68,
			141, 174, 156, 211, 168, 218, 170, 16, 120, 78, 113, 7, 85, 75,
			60, 167, 184, 131, 74, 113, 158, 83, 220, 193, 189, 111, 166, 171,
			238, 165, 127, 250, 67, 0, 0, 0, 255, 255, 248, 181, 228, 213,
			183, 9, 0, 0},
	)
}

// FileDescriptorSet returns a descriptor set for this proto package, which
// includes all defined services, and all transitive dependencies.
//
// Will not return nil.
//
// Do NOT modify the returned descriptor.
func FileDescriptorSet() *descriptorpb.FileDescriptorSet {
	// We just need ONE of the service names to look up the FileDescriptorSet.
	ret, err := discovery.GetDescriptorSet("luci.source_index.v1.SourceIndex")
	if err != nil {
		panic(err)
	}
	return ret
}